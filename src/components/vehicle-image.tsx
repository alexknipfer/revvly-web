import { ImageCropDialog } from '@/components/image-crop-dialog';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { VehicleWithImage } from '@/types/vehicles';
import { api } from 'convex/_generated/api';
import { useMutation } from 'convex/react';
import { Car, ImageUp, Loader2 } from 'lucide-react';
import { createContext, useContext, useState } from 'react';
import { useDropzone } from 'react-dropzone';

interface VehicleImageProps {
  vehicle: VehicleWithImage;
  children?: React.ReactNode;
}

interface VehicleImageContextValue {
  vehicle: VehicleWithImage;
}

const VehicleImageContext = createContext<VehicleImageContextValue | null>(
  null,
);

function useVehicleImageContext() {
  const context = useContext(VehicleImageContext);

  if (!context) {
    throw new Error(
      'VehicleImage sub-components must be used within VehicleImage',
    );
  }
  return context;
}

export function VehicleImage({ vehicle, children }: VehicleImageProps) {
  if (!children) {
    return vehicle.imageUrl ? (
      <AspectRatio ratio={16 / 9}>
        <img
          src={vehicle.imageUrl}
          alt={vehicle.model}
          className="w-full h-full object-cover"
        />
      </AspectRatio>
    ) : (
      <AspectRatio
        ratio={16 / 9}
        className="bg-slate-800 rounded-md flex items-center justify-center relative overflow-hidden"
      >
        <Car className="size-7" />
      </AspectRatio>
    );
  }

  return (
    <VehicleImageContext.Provider value={{ vehicle }}>
      <AspectRatio ratio={16 / 9} className="relative">
        {children}
      </AspectRatio>
    </VehicleImageContext.Provider>
  );
}

VehicleImage.Empty = function VehicleImageEmpty() {
  return (
    <div className="w-full h-full bg-slate-800 rounded-md flex items-center justify-center relative overflow-hidden">
      <ImageUp className="size-7 text-slate-400" />
    </div>
  );
};

VehicleImage.Upload = function VehicleImageUpload({
  className,
}: {
  className?: string;
}) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const generateUploadUrl = useMutation(api.storage.generateUploadUrl);
  const updateVehicle = useMutation(api.userVehicles.update);

  const { vehicle } = useVehicleImageContext();

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
    const newPreviewUrl = URL.createObjectURL(croppedBlob);
    setPreviewUrl(newPreviewUrl);
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
};
