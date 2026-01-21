import { z } from 'zod';

export const serviceTypeSchema = z.enum([
  // Oil & Fluids
  'Oil Change',
  'Transmission Fluid Change',
  'Coolant Flush',
  'Brake Fluid Change',
  'Power Steering Fluid Change',
  'Differential Fluid Change',
  'Transfer Case Fluid Change',

  // Brakes
  'Brake Pad Replacement',
  'Brake Rotor Replacement',
  'Brake Caliper Replacement',
  'Brake Inspection',

  // Tires & Wheels
  'Tire Rotation',
  'Tire Replacement',
  'Tire Balance',
  'Wheel Alignment',
  'Tire Pressure Check',

  // Filters
  'Air Filter Replacement',
  'Cabin Air Filter Replacement',
  'Fuel Filter Replacement',

  // Battery & Electrical
  'Battery Replacement',
  'Battery Test',
  'Alternator Replacement',
  'Starter Replacement',
  'Headlight Replacement',
  'Taillight Replacement',

  // Belts & Hoses
  'Serpentine Belt Replacement',
  'Timing Belt Replacement',
  'Hose Replacement',

  // Engine
  'Spark Plug Replacement',
  'Ignition Coil Replacement',
  'Engine Tune Up',
  'Engine Repair',

  // Suspension & Steering
  'Shock Absorber Replacement',
  'Strut Replacement',
  'Control Arm Replacement',
  'Ball Joint Replacement',
  'Tie Rod Replacement',
  'Power Steering Repair',

  // Exhaust
  'Muffler Replacement',
  'Catalytic Converter Replacement',
  'Exhaust System Repair',

  // Climate Control
  'AC Recharge',
  'AC Compressor Replacement',
  'Heater Core Replacement',

  // Wiper & Glass
  'Wiper Blade Replacement',
  'Windshield Replacement',

  // Inspection & Diagnostics
  'State Inspection',
  'Emissions Test',
  'Diagnostic Scan',

  // Other
  'Other',
]);
