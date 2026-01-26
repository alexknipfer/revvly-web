import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { createFileRoute } from '@tanstack/react-router';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ImportFuellyDialog } from '@/modules/settings/components/import-fuelly-dialog';

export const Route = createFileRoute('/_auth/settings')({
  component: RouteComponent,
});

function RouteComponent() {
  const [importDialogOpen, setImportDialogOpen] = useState(false);

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-primary sr-only sm:not-sr-only sm:mb-4">
        Settings
      </h1>
      <Card>
        <CardHeader>
          <CardTitle>Import from Fuelly</CardTitle>
          <CardDescription>
            Import your fuel entries and service records from a Fuelly CSV
            export
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button
            onClick={() => setImportDialogOpen(true)}
            className="w-full sm:w-auto"
          >
            Import From Fuelly
          </Button>
        </CardContent>
      </Card>
      <ImportFuellyDialog
        open={importDialogOpen}
        onOpenChange={setImportDialogOpen}
      />
    </div>
  );
}
