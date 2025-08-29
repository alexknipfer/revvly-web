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
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';

interface Props {
  title: string;
  description: string;
  trigger: React.ReactNode;
  footerContent?: React.ReactNode;
  onOpenChange?: (open: boolean) => void;
}

export function DrawerDialog({
  children,
  title,
  description,
  footerContent,
  trigger,
  onOpenChange,
}: PropsWithChildren<Props>) {
  const [open, setOpen] = React.useState(false);
  const isDesktop = useMediaQuery('(min-width: 768px)');

  if (isDesktop) {
    return (
      <Dialog
        open={open}
        onOpenChange={(open) => {
          setOpen(open);
          onOpenChange?.(open);
        }}
      >
        <DialogTrigger asChild>{trigger}</DialogTrigger>
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
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>{trigger}</DrawerTrigger>
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
