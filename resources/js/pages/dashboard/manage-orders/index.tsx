import TableToolbar from '@/components/data-table/table-toolbar';
import { Button } from '@/components/ui/button';
import { useDebouncedSearch } from '@/hooks/use-debounce-hooks';
import AppLayout from '@/layouts/app-layout';
import OrderTable from '@/pages/dashboard/manage-orders/components/order-table';
import { BreadcrumbItem, Order, PaginatedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Data Pesanan',
        href: '/dashboard/orders',
    },
];

type Props = {
    order: PaginatedData<Order>;
};

export default function Index({ order }: Props) {
    const { filters } = usePage().props;
    const { params, setParams, setDebounceTime } = useDebouncedSearch({
        url: route('dashboard.orders.manage.orders'),
        initialParams: filters,
    });

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Data Pesanan" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="flex flex-col justify-between gap-4 sm:flex-row">
                    <TableToolbar search={params.search || ''} params={params} setParams={setParams} setDebounceTime={setDebounceTime} />
                    <Button asChild>
                        <Link href={route('dashboard.products.create')}>Tambah Produk</Link>
                    </Button>
                </div>
                <OrderTable order={order} />
            </div>
        </AppLayout>
    );
}
