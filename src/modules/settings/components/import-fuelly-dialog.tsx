import { useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X, Loader2, FileText, AlertTriangle } from 'lucide-react';

import { DrawerDialog } from '@/components/ui/dialog-drawer';
import { Button } from '@/components/ui/button';
import { Field, FieldError } from '@/components/ui/field';
import { useServerFn } from '@tanstack/react-start';
import { useMutation } from '@tanstack/react-query';

import type { FuellyCsvPreview } from '../types';
import { parseFuellyCsvPreviewServerFn } from '../server/server-fns';
import { ImportFuellyConfirmationDialog } from './import-fuelly-confirmation-dialog';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { toast } from 'sonner';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onImportComplete?: () => void;
}

export function ImportFuellyDialog({ open, onOpenChange }: Props) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [csvPreview, setCsvPreview] = useState<FuellyCsvPreview | null>(null);
  const [showMappingDialog, setShowMappingDialog] = useState(false);

  const handleRemoveFile = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setSelectedFile(null);
    setPreviewUrl(null);
    setError(null);
    setCsvPreview(null);
  };

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const parseCsvPreview = useServerFn(parseFuellyCsvPreviewServerFn);
  const { mutate: parseCsvMutation, isPending: isParsing } = useMutation({
    mutationFn: parseCsvPreview,
    onSuccess: (data) => {
      setCsvPreview(data);
      setShowMappingDialog(true);
    },
    onError: (err) => {
      setError(err instanceof Error ? err.message : 'Failed to parse CSV file');
    },
  });

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'text/csv': ['.csv'],
    },
    maxSize: 4 * 1024 * 1024, // 4MB
    onDrop: (acceptedFiles, rejectedFiles) => {
      if (rejectedFiles.length > 0) {
        const rejection = rejectedFiles[0];
        if (rejection.errors.some((e) => e.code === 'file-too-large')) {
          setError('File size must be no larger than 4MB');
        } else if (
          rejection.errors.some((e) => e.code === 'file-invalid-type')
        ) {
          setError('Please select a CSV file');
        } else {
          setError('Failed to upload file');
        }
        return;
      }

      const file = acceptedFiles[0];

      if (file) {
        setError(null);
        setSelectedFile(file);
        // Create a preview URL for CSV (just show filename)
        setPreviewUrl(
          URL.createObjectURL(new Blob(['CSV File'], { type: 'text/plain' })),
        );
      }
    },
  });

  const handleCancel = () => {
    handleRemoveFile();
    onOpenChange(false);
  };

  const handleParseCsv = () => {
    if (!selectedFile) {
      return;
    }

    const formData = new FormData();
    formData.append('file', selectedFile);

    parseCsvMutation({ data: formData });
  };

  const handleMappingComplete = () => {
    handleRemoveFile();
    setShowMappingDialog(false);
    onOpenChange(false);
    toast.success('Fuelly data imported successfully');
  };

  return (
    <>
      <DrawerDialog
        title="Import From Fuelly"
        description="Upload your Fuelly CSV export to import fuel entries and services"
        open={open && !showMappingDialog}
        onOpenChange={(isOpen) => {
          if (!isOpen) {
            handleCancel();
          }
        }}
        footerContent={
          <div className="w-full space-y-3">
            <Alert variant="destructive">
              <AlertTriangle className="size-4" />
              <AlertTitle>Warning</AlertTitle>
              <AlertDescription>
                Importing data will delete all existing fuel entries and
                services for the selected vehicles and replace them with the
                data from your CSV file. This action cannot be undone.
              </AlertDescription>
            </Alert>
            <div className="flex gap-2 w-full">
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                className="flex-1"
                disabled={isParsing}
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={handleParseCsv}
                disabled={!selectedFile || isParsing}
                loading={isParsing}
                className="flex-1"
              >
                {isParsing ? 'Parsing...' : 'Continue'}
              </Button>
            </div>
          </div>
        }
      >
        <div className="space-y-4">
          <Field>
            <div className="relative">
              {!previewUrl ? (
                <div
                  {...getRootProps()}
                  className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 flex flex-col items-center justify-center gap-4 hover:border-muted-foreground/50 transition-colors cursor-pointer"
                >
                  <input {...getInputProps()} id="csv-upload" />
                  <Upload className="size-8 text-muted-foreground" />
                  <div className="text-center">
                    <p className="text-sm font-medium">
                      Click to upload or drag and drop
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      CSV file up to 4MB
                    </p>
                  </div>
                </div>
              ) : (
                <div className="relative">
                  <div className="border rounded-lg overflow-hidden bg-muted p-4 flex items-center gap-3">
                    <FileText className="size-8 text-muted-foreground" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {selectedFile?.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {(selectedFile?.size || 0) / 1024} KB
                      </p>
                    </div>
                  </div>
                  {!isParsing && (
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2"
                      onClick={handleRemoveFile}
                    >
                      <X className="size-4" />
                    </Button>
                  )}
                </div>
              )}
              {isParsing && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-background/95 backdrop-blur-sm z-10 rounded-lg">
                  <div className="relative">
                    <Loader2 className="size-12 text-primary animate-spin" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="size-8 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
                    </div>
                  </div>
                  <div className="text-center space-y-1">
                    <p className="text-sm font-medium">Parsing CSV file...</p>
                    <p className="text-xs text-muted-foreground">
                      Extracting vehicle information
                    </p>
                  </div>
                </div>
              )}
            </div>
            {error && <FieldError errors={[{ message: error }]} />}
          </Field>
        </div>
      </DrawerDialog>

      {csvPreview && selectedFile && (
        <ImportFuellyConfirmationDialog
          open={showMappingDialog}
          onOpenChange={(isOpen) => {
            if (!isOpen) {
              setShowMappingDialog(false);
              handleCancel();
            }
          }}
          csvFile={selectedFile}
          csvPreview={csvPreview}
          onImportComplete={handleMappingComplete}
        />
      )}
    </>
  );
}
