import { createServerFn } from '@tanstack/react-start';
import { z } from 'zod';
import dayjs from 'dayjs';

import { api } from 'convex/_generated/api';
import { tryCatch } from '@/lib/utils';
import { getAuthConvexClient } from '@/lib/auth';
import { captureException } from '@/lib/logger';
import { appendSentryUser } from '@/middleware/append-sentry-user';

import type { Id } from 'convex/_generated/dataModel';
import {
  FuelLevel,
  FuelType,
  FuellyFuelEntryImport,
  FuellyServiceImport,
} from '@/types/fuel-entry';
import { MAX_SERVER_FUNC_ATTACHMENT_SIZE } from '@/lib/constants';

const requiredHeaders = [
  'type',
  'mpg',
  'date',
  'time',
  'vehicle',
  'odometer',
  'filled up',
  'cost/gallon',
  'gallons',
  'total cost',
  'octane',
  'gas brand',
  'location',
  'tags',
  'payment type',
  'tire pressure',
  'notes',
  'services',
];

// CSV parsing helper
function parseCSV(csvText: string): string[][] {
  const rows: string[][] = [];
  let currentRow: string[] = [];
  let currentField = '';
  let inQuotes = false;

  for (let i = 0; i < csvText.length; i++) {
    const char = csvText[i];
    const nextChar = csvText[i + 1];

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        // Escaped quote
        currentField += '"';
        i++; // Skip next quote
      } else {
        // Toggle quote state
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      // Field separator
      currentRow.push(currentField.trim());
      currentField = '';
    } else if ((char === '\n' || char === '\r') && !inQuotes) {
      // Row separator
      if (currentField || currentRow.length > 0) {
        currentRow.push(currentField.trim());
        rows.push(currentRow);
        currentRow = [];
        currentField = '';
      }
      // Skip \r\n
      if (char === '\r' && nextChar === '\n') {
        i++;
      }
    } else {
      currentField += char;
    }
  }

  // Add last field and row
  if (currentField || currentRow.length > 0) {
    currentRow.push(currentField.trim());
    rows.push(currentRow);
  }

  return rows;
}

// Parse number with commas and currency symbols
function parseNumber(value: string): number {
  if (!value || value.trim() === '') {
    return 0;
  }

  return parseFloat(value.replace(/[,$]/g, '')) || 0;
}

// Parse date and time to ISO string
function parseDateTime(dateStr: string, timeStr: string): string {
  try {
    // Parse time (e.g., "2:01 PM" or "14:01")
    let hours = 0;
    let minutes = 0;

    if (timeStr) {
      const timeMatch = timeStr.match(/(\d+):(\d+)\s*(AM|PM)?/i);
      if (timeMatch) {
        hours = parseInt(timeMatch[1], 10);
        minutes = parseInt(timeMatch[2], 10);
        const period = timeMatch[3]?.toUpperCase();

        if (period === 'PM' && hours !== 12) {
          hours += 12;
        } else if (period === 'AM' && hours === 12) {
          hours = 0;
        }
      }
    }

    // Parse date (e.g., "2025-01-18")
    const date = dayjs(dateStr);
    if (!date.isValid()) {
      return new Date().toISOString();
    }

    return date
      .hour(hours)
      .minute(minutes)
      .second(0)
      .millisecond(0)
      .toISOString();
  } catch {
    return new Date().toISOString();
  }
}

function parseFuelLevel(value: string): FuelLevel {
  if (value === 'Reset') {
    return 'Full';
  } else if (value === 'Partial') {
    return 'Partial';
  } else {
    return 'Full';
  }
}

export type FuellyCsvPreviewServerFnResult = Awaited<
  ReturnType<typeof parseFuellyCsvPreviewServerFn>
>;

export const parseFuellyCsvPreviewServerFn = createServerFn({
  method: 'POST',
})
  .middleware([appendSentryUser])
  .inputValidator((data) => {
    if (!(data instanceof FormData)) {
      throw new Error('Expected FormData');
    }

    const file = data.get('file');

    if (!(file instanceof File)) {
      throw new Error('Expected file');
    }

    if (!file.name.endsWith('.csv')) {
      throw new Error('File must be a CSV file');
    }

    if (file.size > MAX_SERVER_FUNC_ATTACHMENT_SIZE) {
      throw new Error(
        `File size must be no larger than ${MAX_SERVER_FUNC_ATTACHMENT_SIZE / 1024 / 1024}MB`,
      );
    }

    return { file };
  })
  .handler(async ({ data }) => {
    const { file } = data;

    const [readError, csvText] = await tryCatch(file.text());

    if (readError) {
      captureException(readError);
      throw new Error('Failed to read CSV file');
    }

    const rows = parseCSV(csvText);

    if (rows.length < 2) {
      throw new Error(
        'CSV file must contain at least a header row and one data row',
      );
    }

    const headers = rows[0].map((h) => h.toLowerCase().trim());

    // All headers that should be present in a valid Fuelly CSV export

    const missingHeaders: string[] = [];

    for (const requiredHeader of requiredHeaders) {
      if (!headers.includes(requiredHeader)) {
        missingHeaders.push(requiredHeader);
      }
    }

    if (missingHeaders.length > 0) {
      throw new Error(
        `This is not a valid Fuelly CSV file. Missing required columns: ${missingHeaders
          .map((h) => {
            // Capitalize first letter of each word
            return `"${h
              .split(' ')
              .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
              .join(' ')}"`;
          })
          .join(', ')}. Please export your data from Fuelly and try again.`,
      );
    }

    // Get indices for required columns
    const typeIndex = headers.indexOf('type');
    const vehicleIndex = headers.indexOf('vehicle');

    const vehicleCounts = new Map<
      string,
      { fuelEntries: number; services: number }
    >();
    let totalFuelEntries = 0;
    let totalServices = 0;

    // Process data rows (skip header)
    for (let i = 1; i < rows.length; i++) {
      const row = rows[i];
      if (row.length <= Math.max(typeIndex, vehicleIndex)) {
        continue;
      }

      const type = row[typeIndex]?.trim();
      const vehicle = row[vehicleIndex]?.trim();

      if (!vehicle) {
        continue;
      }

      if (!vehicleCounts.has(vehicle)) {
        vehicleCounts.set(vehicle, { fuelEntries: 0, services: 0 });
      }

      const counts = vehicleCounts.get(vehicle)!;

      if (type === 'Gas') {
        counts.fuelEntries++;
        totalFuelEntries++;
      } else if (type === 'Service') {
        counts.services++;
        totalServices++;
      }
    }

    const vehicles = Array.from(vehicleCounts.entries()).map(
      ([name, counts]) => ({
        name,
        fuelEntryCount: counts.fuelEntries,
        serviceCount: counts.services,
      }),
    );

    return {
      vehicles,
      totalFuelEntries,
      totalServices,
    };
  });

export type ImportFuellyDataServerFnResult = Awaited<
  ReturnType<typeof importFuellyDataServerFn>
>;

const fuelTypeMap = {
  'Low [Octane: 85]': 'Low (Octane 85)',
  'Low [Octane: 86]': 'Low (Octane 86)',
  'Regular [Octane: 87]': 'Regular (Octane 87)',
  'Mid [Octane: 88]': 'Mid (Octane 88)',
  'Mid [Octane: 89]': 'Mid (Octane 89)',
  'High [Octane: 90]': 'High (Octane 90)',
  'Premium [Octane: 91]': 'Premium (Octane 91)',
  'Premium [Octane: 92]': 'Premium (Octane 92)',
  'Premium [Octane: 93]': 'Premium (Octane 93)',
  'Super [Octane: 94]': 'Super (Octane 94)',
  'Super [Octane: 95]': 'Super (Octane 95)',
  'Super [Octane: 98]': 'Super (Octane 98)',
  '4D': 'Diesel 4D',
  Synthetic: 'Diesel Synthetic',
  '2D [Cetane: 40]': 'Diesel 2D (Cetane 40)',
  '1D [Cetane: 44]': 'Diesel 1D (Cetane 44)',
  'ULSD [Cetane: 45]': 'Diesel ULSD (Cetane 45)',
  E10: 'E10',
  E15: 'E15',
  'E22 - Gasohol': 'E22',
  E30: 'E30',
  E50: 'E50',
  E85: 'E85',
  E93: 'E93',
  E100: 'E100',
  B99: 'B99',
  B100: 'B100',
  'Blend B2': 'Blend B2',
  'Blend B5': 'Blend B5',
  'Blend B20 [Cetane: 50]': 'Blend B20 (Cetane 50)',
  'Autogas/LPG': 'Autogas/LPG',
  'CNG - Methane': 'CNG',
} satisfies Record<string, FuelType>;

export const importFuellyDataServerFn = createServerFn({
  method: 'POST',
})
  .middleware([appendSentryUser])
  .inputValidator((data) => {
    if (!(data instanceof FormData)) {
      throw new Error('Expected FormData');
    }

    const file = data.get('file');
    const mappingsStr = data.get('mappings')?.toString();

    if (!(file instanceof File)) {
      throw new Error('Expected file');
    }

    if (!file.name.endsWith('.csv')) {
      throw new Error('File must be a CSV file');
    }

    if (file.size > MAX_SERVER_FUNC_ATTACHMENT_SIZE) {
      throw new Error(
        `File size must be no larger than ${MAX_SERVER_FUNC_ATTACHMENT_SIZE / 1024 / 1024}MB`,
      );
    }

    if (!mappingsStr) {
      throw new Error('Vehicle mappings are required');
    }

    let mappings: Record<string, string | null>;
    try {
      const parsed = JSON.parse(mappingsStr);
      mappings = z.record(z.string(), z.string().nullable()).parse(parsed);
    } catch (error) {
      captureException(error);
      throw new Error('Invalid vehicle mappings format');
    }

    const validMappings = Object.fromEntries(
      Object.entries(mappings).filter(([_, value]) => value !== null),
    );

    if (Object.keys(validMappings).length === 0) {
      throw new Error('At least one vehicle must be mapped');
    }

    return { file, mappings: validMappings };
  })
  .handler(async ({ data }) => {
    const { file, mappings } = data;

    const [readError, csvText] = await tryCatch(file.text());

    if (readError) {
      captureException(readError);
      throw new Error('Failed to read CSV file');
    }

    const rows = parseCSV(csvText);

    if (rows.length < 2) {
      throw new Error(
        'CSV file must contain at least a header row and one data row',
      );
    }

    const headers = rows[0].map((h) => h.toLowerCase().trim());

    // Check for required headers
    const missingHeaders: string[] = [];
    for (const requiredHeader of requiredHeaders) {
      if (!headers.includes(requiredHeader)) {
        missingHeaders.push(requiredHeader);
      }
    }

    if (missingHeaders.length > 0) {
      throw new Error(
        `This is not a valid Fuelly CSV file. Missing required columns: ${missingHeaders
          .map((h) => {
            // Capitalize first letter of each word
            return `"${h
              .split(' ')
              .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
              .join(' ')}"`;
          })
          .join(', ')}. Please export your data from Fuelly and try again.`,
      );
    }

    const headerMap: Record<string, number> = {};
    headers.forEach((h, i) => {
      headerMap[h] = i;
    });

    const fuelEntries: Array<FuellyFuelEntryImport> = [];
    const services: Array<FuellyServiceImport> = [];

    const errors: string[] = [];

    for (let i = 1; i < rows.length; i++) {
      const row = rows[i];
      if (row.length < headers.length) continue;

      const getValue = (key: string): string => {
        const index = headerMap[key];
        return index !== undefined ? (row[index] || '').trim() : '';
      };

      const type = getValue('type');
      const vehicleName = getValue('vehicle');
      const vehicleId = mappings[vehicleName];

      if (!vehicleId) {
        continue;
      }

      try {
        if (type === 'Gas') {
          const date = getValue('date');
          const time = getValue('time');
          const odometer = parseNumber(getValue('odometer'));
          const costPerGallon = parseNumber(getValue('cost/gallon'));
          const gallons = parseNumber(getValue('gallons'));
          const totalCost =
            parseNumber(getValue('total cost')) || costPerGallon * gallons;
          const mpgStr = getValue('mpg');
          const fuelType = getValue('octane');
          const filledUp = getValue('filled up');
          const location = getValue('location');
          const notes = getValue('notes');

          if (!date || odometer === 0 || gallons === 0) {
            errors.push(`Row ${i + 1}: Missing required fields for fuel entry`);
            continue;
          }

          fuelEntries.push({
            date: parseDateTime(date, time),
            odometer,
            costPerGallon,
            totalGallons: gallons,
            totalCost,
            totalMiles: 0, // Will be calculated after sorting
            mpg:
              mpgStr && parseNumber(mpgStr) > 0
                ? parseNumber(mpgStr)
                : undefined,
            type:
              fuelTypeMap[fuelType as keyof typeof fuelTypeMap] ??
              'Regular (Octane 87)',
            level: parseFuelLevel(filledUp),
            location: location || undefined,
            notes: notes || undefined,
            vehicleId: vehicleId as Id<'vehicles'>,
            missedFuelup: filledUp === 'Reset',
          });
        } else if (type === 'Service') {
          const date = getValue('date');
          const time = getValue('time');
          const odometer = parseNumber(getValue('odometer'));
          const cost = parseNumber(getValue('total cost'));
          const servicesStr = getValue('services');
          const location = getValue('location');
          const notes = getValue('notes');

          if (!date || odometer === 0) {
            errors.push(`Row ${i + 1}: Missing required fields for service`);
            continue;
          }

          const serviceTypes = servicesStr
            ? servicesStr
                .split(',')
                .map((s) => s.trim())
                .filter(Boolean)
            : [];

          if (serviceTypes.length === 0) {
            errors.push(
              `Row ${i + 1}: Service must have at least one service type`,
            );
            continue;
          }

          services.push({
            date: parseDateTime(date, time),
            odometer,
            cost,
            location: location || undefined,
            types: serviceTypes,
            notes: notes || undefined,
            vehicleId: vehicleId as Id<'vehicles'>,
          });
        }
      } catch (error) {
        captureException(error);
        errors.push(
          `Row ${i + 1}: ${error instanceof Error ? error.message : 'Unknown error'}`,
        );
      }
    }

    // Group fuel entries by vehicle and calculate totalMiles
    const fuelEntriesByVehicle = new Map<string, typeof fuelEntries>();
    fuelEntries.forEach((entry) => {
      if (!fuelEntriesByVehicle.has(entry.vehicleId)) {
        fuelEntriesByVehicle.set(entry.vehicleId, []);
      }
      fuelEntriesByVehicle.get(entry.vehicleId)!.push(entry);
    });

    // Sort by date/odometer and calculate totalMiles for each vehicle
    for (const [, vehicleEntries] of fuelEntriesByVehicle.entries()) {
      // Sort by date, then odometer
      vehicleEntries.sort((a, b) => {
        const dateCompare = a.date.localeCompare(b.date);

        if (dateCompare !== 0) {
          return dateCompare;
        }

        return a.odometer - b.odometer;
      });

      // Calculate totalMiles for each entry
      for (let i = 0; i < vehicleEntries.length; i++) {
        const entry = vehicleEntries[i];
        if (i === 0 || entry.missedFuelup) {
          entry.totalMiles = 0;
        } else {
          const previousEntry = vehicleEntries[i - 1];
          const miles = entry.odometer - previousEntry.odometer;
          entry.totalMiles = miles > 0 ? miles : 0;
        }
      }
    }

    const processedFuelEntries = Array.from(
      fuelEntriesByVehicle.values(),
    ).flat();

    const [convexClientError, convexClient] = await tryCatch(
      getAuthConvexClient(),
    );

    if (convexClientError) {
      captureException(convexClientError);
      throw new Error('Failed to get Convex client');
    }

    fuelEntries.sort((a, b) => {
      const dateCompare = a.date.localeCompare(b.date);

      if (dateCompare !== 0) {
        return dateCompare;
      }

      return a.odometer - b.odometer;
    });

    let fuelEntriesImported = 0;
    if (processedFuelEntries.length > 0) {
      const [importError, result] = await tryCatch(
        convexClient.mutation(api.importFuellyData.importFuelEntries, {
          entries: processedFuelEntries,
        }),
      );

      if (importError) {
        captureException(importError);
        errors.push(
          `Failed to import fuel entries: ${importError instanceof Error ? importError.message : 'Unknown error'}`,
        );
      } else {
        fuelEntriesImported = result || 0;
      }
    }

    let servicesImported = 0;
    if (services.length > 0) {
      const [importError, result] = await tryCatch(
        convexClient.mutation(api.importFuellyData.importServices, {
          services,
        }),
      );

      if (importError) {
        captureException(importError);
        errors.push(
          `Failed to import services: ${importError instanceof Error ? importError.message : 'Unknown error'}`,
        );
      } else {
        servicesImported = result || 0;
      }
    }

    return {
      fuelEntriesImported,
      servicesImported,
      errors,
    };
  });
