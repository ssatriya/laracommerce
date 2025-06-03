import TableToolbar from '@/components/data-table/table-toolbar';
import { Button } from '@/components/ui/button';
import { useDebouncedSearch } from '@/hooks/use-debounce-hooks';
import AppLayout from '@/layouts/app-layout';
import ProductTable from '@/pages/dashboard/products/components/product-table';
import { BreadcrumbItem, PaginatedData, Product } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Data Produk',
        href: '/dashboard/categories',
    },
];

type Props = {
    product: PaginatedData<Product>;
};

export default function Index({ product }: Props) {
    const { filters } = usePage().props;
    const { params, setParams, setDebounceTime } = useDebouncedSearch({
        url: route('dashboard.products.index'),
        initialParams: filters,
    });

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Data Produk" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="flex flex-col justify-between gap-4 sm:flex-row">
                    <TableToolbar search={params.search || ''} params={params} setParams={setParams} setDebounceTime={setDebounceTime} />
                    <Button asChild>
                        <Link href={route('dashboard.products.create')}>Tambah Produk</Link>
                    </Button>
                </div>
                <ProductTable product={product} />
            </div>
        </AppLayout>
    );
}
