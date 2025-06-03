'use client';

import * as React from 'react';

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

type Props = {
    children: React.ReactNode;
    outerOpen: boolean;
    // setOuterOpen: React.Dispatch<React.SetStateAction<boolean>>;
    setOuterOpen: (value: boolean) => void;
    setInnerOpen: (value: boolean) => void;
    innerOpen: boolean;
    // setInnerOpen: React.Dispatch<React.SetStateAction<boolean>>;
    isDirty: boolean;
    title: string;
    description: string;
    className?: string;
    onClose?: () => void;
};

const ResponsiveDialog = ({ children, outerOpen, setOuterOpen, innerOpen, setInnerOpen, isDirty, title, description, className, onClose }: Props) => {
    const handleOuterOpenChange = React.useCallback(
        (open: boolean) => {
            if (!open && isDirty) {
                setInnerOpen(true);
            } else if (!open) {
                // Use onClose if provided, otherwise fall back to setOuterOpen
                if (onClose) {
                    onClose();
                } else {
                    setOuterOpen(open);
                }
            } else {
                setOuterOpen(open);
            }
        },
        [isDirty, setOuterOpen, setInnerOpen, onClose],
    );

    return (
        <Dialog open={outerOpen} onOpenChange={handleOuterOpenChange}>
            <DialogContent className={cn('sm:max-w-5xl', className)}>
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription>{description}</DialogDescription>
                </DialogHeader>
                {children}

                <AlertDialog open={innerOpen}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Yakin ingin meninggalkan halaman?</AlertDialogTitle>
                            <AlertDialogDescription>
                                Semua perubahan yang belum disimpan pada form akan terhapus secara permanen apabila belum disimpan.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel onClick={() => setInnerOpen(false)}>Tetap mengedit</AlertDialogCancel>
                            <AlertDialogAction
                                onClick={() => {
                                    setInnerOpen(false);
                                    setTimeout(() => {
                                        setOuterOpen(false);
                                    }, 200);
                                }}
                            >
                                Keluar
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </DialogContent>
        </Dialog>
    );
};

export default ResponsiveDialog;
