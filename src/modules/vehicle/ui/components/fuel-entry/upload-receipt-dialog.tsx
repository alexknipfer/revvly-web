import { useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X, Loader2, Receipt } from 'lucide-react';

import { DrawerDialog } from '@/components/ui/dialog-drawer';
import { Button } from '@/components/ui/button';
import { Field, FieldError } from '@/components/ui/field';
import { useServerFn } from '@tanstack/react-start';
import { useMutation } from '@tanstack/react-query';

import { uploadFuelEntryReceiptServerFn } from '../../../server/server-fns';
import type { FuelType } from '@/modules/core/types/vehicles';
import { Id } from 'convex/_generated/dataModel';
import { useConvexUpload } from '@/modules/core/hooks/use-convex-upload';

interface Props {
  onComplete?: (data: {
    gasStation?: string;
    totalGallons?: number;
    costPerGallon?: number;
    typeOfFuel?: FuelType;
  }) => void;
}

export function UploadReceiptDialog({ onComplete }: Props) {
  const [open, setOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [storageId, setStorageId] = useState<Id<'_storage'> | null>(null);
  const { uploadFile, deleteFile, isUploading } = useConvexUpload();

  const handleRemoveFile = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setSelectedFile(null);
    setPreviewUrl(null);
    setError(null);
  };

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const uploadFuelEntryReceipt = useServerFn(uploadFuelEntryReceiptServerFn);
  const { mutate: uploadFuelEntryReceiptMutation, isPending: isProcessing } =
    useMutation({
      mutationFn: uploadFuelEntryReceipt,
      onSuccess: (data) => {
        if (data.error) {
          setError(data.error);
          return;
        }

        handleRemoveFile();
        setOpen(false);
        onComplete?.({
          gasStation: data.gasStationNameWithAddress,
          totalGallons: data.totalGallons,
          costPerGallon: data.costPerGallon,
          typeOfFuel: data.typeOfFuel,
        });
      },
      onError: (err) => {
        setError(
          err instanceof Error ? err.message : 'Failed to process receipt',
        );
      },
      onSettled: () => {
        if (storageId) {
          deleteFile(storageId);
        }
        setStorageId(null);
      },
    });

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'image/jpeg': ['.jpeg', '.jpg'],
      'image/png': ['.png'],
    },
    maxSize: 10 * 1024 * 1024,
    onDrop: (acceptedFiles, rejectedFiles) => {
      if (rejectedFiles.length > 0) {
        const rejection = rejectedFiles[0];
        if (rejection.errors.some((e) => e.code === 'file-too-large')) {
          setError('File size must be no larger than 5MB');
        } else if (
          rejection.errors.some((e) => e.code === 'file-invalid-type')
        ) {
          setError('Please select an image file (PNG, JPG, WEBP)');
        } else {
          setError('Failed to upload file');
        }
        return;
      }

      const file = acceptedFiles[0];

      if (file) {
        setError(null);
        setSelectedFile(file);
        setPreviewUrl(URL.createObjectURL(file));
      }
    },
  });

  const handleCancel = () => {
    handleRemoveFile();
    setOpen(false);
  };

  const handleProcessReceipt = async () => {
    if (!selectedFile) {
      return;
    }

    const { fileUrl, storageId, error } = await uploadFile(selectedFile);

    if (error) {
      setError(error);
      return;
    }

    if (storageId) {
      setStorageId(storageId);
    }

    if (fileUrl) {
      uploadFuelEntryReceiptMutation({
        data: {
          imageUrl: fileUrl,
        },
      });
    }
  };

  return (
    <>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => {
          setOpen(true);
        }}
        className="text-muted-foreground hover:text-foreground"
      >
        <Receipt className="size-4 mr-2" />
        Import from Receipt
      </Button>

      <DrawerDialog
        title="Upload Receipt"
        description="Upload a receipt image to automatically fill fuel entry details"
        open={open}
        onOpenChange={(open) => {
          if (!open) {
            handleRemoveFile();
          }

          setOpen(open);
        }}
        footerContent={
          <div className="flex gap-2 w-full">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              className="flex-1"
              disabled={isProcessing || isUploading}
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleProcessReceipt}
              disabled={!selectedFile || isProcessing || isUploading}
              loading={isProcessing || isUploading}
              className="flex-1"
            >
              {isProcessing || isUploading
                ? 'Processing...'
                : 'Process Receipt'}
            </Button>
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
                  <input {...getInputProps()} id="receipt-upload" />
                  <Upload className="size-8 text-muted-foreground" />
                  <div className="text-center">
                    <p className="text-sm font-medium">
                      Click to upload or drag and drop
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      PNG, JPG, WEBP up to 5MB
                    </p>
                  </div>
                </div>
              ) : (
                <div className="relative">
                  <div className="border rounded-lg overflow-hidden bg-muted">
                    <img
                      src={previewUrl}
                      alt="Receipt preview"
                      className="w-full h-auto max-h-[400px] object-contain"
                    />
                  </div>
                  {!isProcessing && !isUploading && (
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
              {(isProcessing || isUploading) && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-background/95 backdrop-blur-sm z-10 rounded-lg">
                  <div className="relative">
                    <Loader2 className="size-12 text-primary animate-spin" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="size-8 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
                    </div>
                  </div>
                  <div className="text-center space-y-1">
                    <p className="text-sm font-medium">
                      {isProcessing
                        ? 'Processing receipt...'
                        : 'Uploading receipt...'}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Extracting fuel entry details
                    </p>
                  </div>
                </div>
              )}
            </div>
            {error && <FieldError errors={[{ message: error }]} />}
          </Field>
        </div>
      </DrawerDialog>
    </>
  );
}
