import { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { ImageUp, Loader2 } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import { useServerFn } from '@tanstack/react-start';

import { ImageCropDialog } from '@/components/image-crop-dialog';
import { uploadVehicleImageServerFn } from '@/modules/vehicle/server/server-fns';
import { useVehicleImageContext } from '@/modules/vehicle/ui/components/vehicle-image/context';

export function VehicleImageUpload({ className }: { className?: string }) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const uploadVehicleImage = useServerFn(uploadVehicleImageServerFn);
  const { mutate: uploadVehicleImageMutation } = useMutation({
    mutationFn: uploadVehicleImage,
    onSuccess: (data) => {
      console.log('Upload successful', data);
    },
  });

  const { vehicle } = useVehicleImageContext();

  const { getRootProps, getInputProps } = useDropzone({
    noDrag: true,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png'],
    },
    onDrop: (files) => {
      const file = files.at(0);

      if (file) {
        setSelectedFile(file);
      }
    },
  });

  const handleCropComplete = async (croppedBlob: Blob) => {
    const newPreviewUrl = URL.createObjectURL(croppedBlob);
    setPreviewUrl(newPreviewUrl);
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('vehicleId', vehicle._id);
      formData.append('image', croppedBlob);

      uploadVehicleImageMutation({
        data: formData,
      });
    } catch (error) {
      console.error('Error uploading image:', error);
    } finally {
      setUploading(false);
    }
  };

  const vehicleImageUrl = previewUrl || vehicle.imageUrl;

  return (
    <>
      {vehicleImageUrl ? (
        <>
          <img
            src={vehicleImageUrl}
            alt={vehicle.model}
            className="w-full h-full object-cover"
          />
          <div {...getRootProps()} className={className}>
            <input {...getInputProps()} />
            <div className="absolute inset-0 bg-black/0 hover:bg-black/20 transition-colors flex items-center justify-center">
              <ImageUp className="size-7 text-white opacity-0 hover:opacity-100 transition-opacity" />
            </div>
          </div>
        </>
      ) : (
        <div
          className="w-full h-full bg-slate-800 rounded-md flex items-center justify-center relative overflow-hidden cursor-pointer"
          {...getRootProps()}
        >
          <input {...getInputProps()} />
          <ImageUp className="size-7 text-slate-400" />
        </div>
      )}
      {uploading && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
          <Loader2 className="size-8 animate-spin text-white" />
        </div>
      )}
      <ImageCropDialog
        file={selectedFile}
        open={!!selectedFile}
        onOpenChange={(isOpen) => !isOpen && setSelectedFile(null)}
        onCropComplete={handleCropComplete}
      />
    </>
  );
}
