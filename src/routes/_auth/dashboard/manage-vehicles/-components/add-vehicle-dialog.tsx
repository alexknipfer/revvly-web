import { PlusIcon } from 'lucide-react';
import { z } from 'zod/v3';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { convexQuery } from '@convex-dev/react-query';
import { api } from 'convex/_generated/api';
import { useQuery } from '@tanstack/react-query';

import { Combobox } from '@/components/ui/combobox';
import { getSupportedVehicleYears } from '@/lib/utils';
import { DrawerDialog } from '@/components/ui/dialog-drawer';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

const formSchema = z.object({
  year: z.string(),
  make: z.string(),
});

export function AddVehicleDialog() {
  const [open, setOpen] = useState(false);
  const { data = [] } = useQuery({
    ...convexQuery(api.vehicles.getVehicleMakesByYear, { year: 2023 }),
    enabled: open,
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      year: '',
      make: '',
    },
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    console.log('data: ', data);
  };

  return (
    <DrawerDialog
      title="Add Vehicle"
      description="Add your vehicle to begin tracking"
      onOpenChange={setOpen}
      trigger={
        <Button
          type="button"
          className="fixed bottom-5 right-5 rounded-full bg-blue-500 h-12 w-12 ring-1 ring-blue-700"
        >
          <PlusIcon className="text-white size-5" />
        </Button>
      }
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          <FormField
            control={form.control}
            name="year"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Year</FormLabel>
                <FormControl>
                  <Combobox
                    label="Select Year"
                    items={getSupportedVehicleYears().map((year) => ({
                      value: year,
                      label: year,
                    }))}
                    value={field.value}
                    onChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="make"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Make</FormLabel>
                <FormControl>
                  <Combobox
                    label="Select Make"
                    items={data.map((make) => ({ value: make, label: make }))}
                    value={field.value}
                    onChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>
    </DrawerDialog>
  );
}
