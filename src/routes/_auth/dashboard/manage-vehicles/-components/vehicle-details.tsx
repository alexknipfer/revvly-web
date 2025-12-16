import { useState } from 'react';
import { useDropzone } from 'react-dropzone';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Doc } from 'convex/_generated/dataModel';
import { ImageUp } from 'lucide-react';
import { ImageCropDialog } from '../../../../../components/image-crop-dialog';

interface Props {
  vehicle: Doc<'vehicles'>;
}

export function VehicleDetails({ vehicle }: Props) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

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

  return (
    <>
      <Card key={vehicle._id}>
        <CardHeader>
          <div
            className="bg-slate-800 rounded-md flex items-center justify-center min-h-48"
            {...getRootProps()}
          >
            <input {...getInputProps()} />
            <ImageUp className="size-7" />
          </div>
        </CardHeader>
        <CardContent>
          <CardTitle>{vehicle.model}</CardTitle>
        </CardContent>
      </Card>
      <ImageCropDialog
        file={selectedFile}
        open={!!selectedFile}
        onOpenChange={(isOpen) => !isOpen && setSelectedFile(null)}
      />
    </>
  );
}
