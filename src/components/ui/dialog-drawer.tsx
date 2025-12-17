import * as React from 'react';
import { PropsWithChildren } from 'react';

import { useMediaQuery } from '@/hooks/use-media-query';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';

interface Props {
  open: boolean;
  title: string;
  description: string;
  footerContent?: React.ReactNode;
  onOpenChange?: (open: boolean) => void;
}

export function DrawerDialog({
  open,
  children,
  title,
  description,
  footerContent,
  onOpenChange,
}: PropsWithChildren<Props>) {
  const isDesktop = useMediaQuery('(min-width: 768px)');

  if (isDesktop) {
    return (
      <Dialog
        open={open}
        onOpenChange={(open) => {
          onOpenChange?.(open);
        }}
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>{description}</DialogDescription>
          </DialogHeader>
          {children}
          {footerContent && <DialogFooter>{footerContent}</DialogFooter>}
        </DialogContent>
      </Dialog>
    );
  }
  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="px-4">
        <DrawerHeader className="text-left">
          <DrawerTitle>{title}</DrawerTitle>
          <DrawerDescription>{description}</DrawerDescription>
        </DrawerHeader>
        {children}
        <DrawerFooter className="pt-2">
          {footerContent && <DrawerFooter>{footerContent}</DrawerFooter>}
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
