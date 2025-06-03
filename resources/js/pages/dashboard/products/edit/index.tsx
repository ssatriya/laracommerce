import AppLayout from '@/layouts/app-layout';
import EditProduct from '@/pages/dashboard/products/edit/components/edit-product';
import { BreadcrumbItem, Product, SelectOption } from '@/types';
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
        title: 'Edit Produk',
        href: '/dashboard/products/edit',
    },
];

type Props = {
    product: Product;
    categories: SelectOption[];
};

export default function Index({ product, categories }: Props) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Data Produk" />
            <div className="flex justify-center">
                <div className="flex h-full max-w-[600px] flex-1 flex-col gap-4 py-4">
                    <EditProduct product={product} categories={categories} />
                </div>
            </div>
        </AppLayout>
    );
}
