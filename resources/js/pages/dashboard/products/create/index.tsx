import AppLayout from '@/layouts/app-layout';
import CreateProduct from '@/pages/dashboard/products/create/components/create-product';
import { BreadcrumbItem, SelectOption } from '@/types';
import { Head } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Data Produk',
        href: '/dashboard/products',
    },
    {
        title: 'Tambah Produk',
        href: '/dashboard/products/create',
    },
];

type Props = {
    categories: SelectOption[];
};

const Index = ({ categories }: Props) => {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Data Produk" />
            <div className="flex justify-center">
                <div className="flex h-full max-w-[600px] flex-1 flex-col gap-4 py-4">
                    <CreateProduct categories={categories} />
                </div>
            </div>
        </AppLayout>
    );
};

export default Index;
