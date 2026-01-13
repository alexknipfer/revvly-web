import ky from 'ky';
import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useConvexMutation } from '@convex-dev/react-query';

import { tryCatch } from '@/modules/core/lib/utils';
import { api } from 'convex/_generated/api';
import { Id } from 'convex/_generated/dataModel';

export function useConvexUpload() {
  const [isUploading, setIsUploading] = useState(false);

  const convexGenerateUploadUrlMutation = useConvexMutation(
    api.storage.generateUploadUrl,
  );
  const { mutateAsync: generateUploadUrlMutation } = useMutation({
    mutationFn: convexGenerateUploadUrlMutation,
  });
  const convexGetFileUrlMutation = useConvexMutation(api.storage.getFileUrl);
  const { mutateAsync: getFileUrlMutation } = useMutation({
    mutationFn: convexGetFileUrlMutation,
  });
  const convexDeleteFileMutation = useConvexMutation(api.storage.deleteFile);
  const { mutateAsync: deleteFileMutation } = useMutation({
    mutationFn: convexDeleteFileMutation,
  });

  const deleteFile = async (storageId: Id<'_storage'>) => {
    const [deleteFileError] = await tryCatch(deleteFileMutation({ storageId }));

    if (deleteFileError) {
      return {
        error: 'Failed to delete file',
      };
    }

    return {
      success: true,
    };
  };

  const uploadFile = async (file: File) => {
    const [generateUploadUrlError, uploadUrl] = await tryCatch(
      generateUploadUrlMutation({}),
    );

    if (generateUploadUrlError) {
      setIsUploading(false);

      return {
        error: 'Failed to upload',
      };
    }

    const [uploadError, uploadResult] = await tryCatch(
      ky
        .post<{ storageId: Id<'_storage'> }>(uploadUrl, {
          headers: { 'Content-Type': file.type },
          body: new Uint8Array(await file.arrayBuffer()),
        })
        .json(),
    );

    if (uploadError) {
      setIsUploading(false);

      return {
        error: 'Failed to upload',
      };
    }

    const [getFileUrlError, fileUrl] = await tryCatch(
      getFileUrlMutation({ storageId: uploadResult.storageId }),
    );

    if (getFileUrlError) {
      setIsUploading(false);

      return {
        error: 'Failed to get file URL',
      };
    }

    setIsUploading(false);

    return {
      storageId: uploadResult.storageId,
      fileUrl,
    };
  };

  return {
    uploadFile,
    deleteFile,
    isUploading,
  };
}
