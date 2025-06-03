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
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import EditCategory from '@/pages/dashboard/categories/components/edit-category';
import { router } from '@inertiajs/react';
import { LoaderCircle, MoreHorizontal, Pencil, Trash2 } from 'lucide-react';
import * as React from 'react';
import { toast } from 'sonner';

type Props = {
    categoryId: string;
    categoryLabel: string;
};

const CategoryAction = ({ categoryId, categoryLabel }: Props) => {
    const [outerOpen, setOuterOpen] = React.useState(false);
    const [innerOpen, setInnerOpen] = React.useState(false);
    const [alertOpen, setAlertOpen] = React.useState(false);
    const [isDeleting, setIsDeleting] = React.useState(false);

    const handleDelete = () => {
        router.delete(route('dashboard.categories.destroy', categoryId), {
            onStart: () => setIsDeleting(true),
            onError: (error) => console.log(error),
            onSuccess: () => {
                toast.success('Kategori berhasil dihapus');
            },
            onFinish: () => setIsDeleting(true),
        });
    };

    return (
        <>
            <DropdownMenu modal={false}>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => setOuterOpen(true)}>
                        <Pencil /> Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem variant="destructive" onClick={() => setAlertOpen(true)}>
                        <Trash2 /> Hapus
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
            <AlertDialog open={alertOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Yakin ingin menghapus data?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Data akan dihapus secara permanen dari database, pastikan Anda menghapus data yang benar.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => setAlertOpen(false)}>Batal</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete} disabled={isDeleting}>
                            {isDeleting && <LoaderCircle className="h-4 w-4 animate-spin" />} Lanjutkan
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
            <EditCategory
                id={categoryId}
                name={categoryLabel}
                innerOpen={innerOpen}
                outerOpen={outerOpen}
                setInnerOpen={setInnerOpen}
                setOuterOpen={setOuterOpen}
            />
        </>
    );
};

export default CategoryAction;
