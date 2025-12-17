import { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { useMutation } from 'convex/react';
import { api } from 'convex/_generated/api';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Doc } from 'convex/_generated/dataModel';
import { ImageUp, Loader2 } from 'lucide-react';
import { ImageCropDialog } from '../../../../../components/image-crop-dialog';
import { AspectRatio } from '@/components/ui/aspect-ratio';

interface Props {
  vehicle: Doc<'vehicles'> & { imageUrl: string | null };
}

export function VehicleDetails({ vehicle }: Props) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const generateUploadUrl = useMutation(api.storage.generateUploadUrl);
  const updateVehicle = useMutation(api.userVehicles.update);

  const { getRootProps, getInputProps } = useDropzone({
    noDrag: true,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp'],
    },
    onDrop: (files) => {
      const file = files.at(0);

      if (file) {
        setSelectedFile(file);
      }
    },
  });

  const handleCropComplete = async (croppedBlob: Blob) => {
    const previewUrl = URL.createObjectURL(croppedBlob);
    setPreviewUrl(previewUrl);
    setUploading(true);

    try {
      const uploadUrl = await generateUploadUrl();

      const uploadResult = await fetch(uploadUrl, {
        method: 'POST',
        headers: { 'Content-Type': croppedBlob.type },
        body: croppedBlob,
      });

      if (!uploadResult.ok) {
        throw new Error('Upload failed');
      }

      const { storageId } = await uploadResult.json();

      await updateVehicle({
        id: vehicle._id,
        update: {
          imageStorageId: storageId,
        },
      });

      setSelectedFile(null);
      setPreviewUrl(null);
    } catch (error) {
      console.error('Error uploading image:', error);
    } finally {
      setUploading(false);
    }
  };

  const vehicleImageUrl = previewUrl || vehicle.imageUrl;

  return (
    <>
      <Card key={vehicle._id}>
        <CardHeader>
          {vehicleImageUrl ? (
            <AspectRatio ratio={16 / 9}>
              <img
                src={vehicleImageUrl}
                alt={vehicle.model}
                className="w-full h-full object-cover"
              />
              {uploading && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <Loader2 className="size-8 animate-spin text-white" />
                </div>
              )}
            </AspectRatio>
          ) : (
            <AspectRatio
              ratio={16 / 9}
              className="bg-slate-800 rounded-md flex items-center justify-center relative overflow-hidden"
              {...getRootProps()}
            >
              <input {...getInputProps()} />
              <ImageUp className="size-7" />
            </AspectRatio>
          )}
        </CardHeader>
        <CardContent>
          <CardTitle>{vehicle.model}</CardTitle>
        </CardContent>
      </Card>
      <ImageCropDialog
        file={selectedFile}
        open={!!selectedFile}
        onOpenChange={(isOpen) => !isOpen && setSelectedFile(null)}
        onCropComplete={handleCropComplete}
      />
    </>
  );
}
