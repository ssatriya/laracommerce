import TableToolbar from '@/components/data-table/table-toolbar';
import { Button } from '@/components/ui/button';
import { useDebouncedSearch } from '@/hooks/use-debounce-hooks';
import AppLayout from '@/layouts/app-layout';
import CategoryTable from '@/pages/dashboard/categories/components/category-table';
import CreateCategory from '@/pages/dashboard/categories/components/create-category';
import { BreadcrumbItem, Category, PaginatedData } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import * as React from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Data Kategori',
        href: '/dashboard/categories',
    },
];

type Props = {
    category: PaginatedData<Category>;
};

export default function Index({ category }: Props) {
    const [outerOpen, setOuterOpen] = React.useState(false);
    const [innerOpen, setInnerOpen] = React.useState(false);

    const { filters } = usePage().props;
    const { params, setParams, setDebounceTime } = useDebouncedSearch({
        url: route('dashboard.categories.index'),
        initialParams: filters,
    });

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Data Kategori" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="flex flex-col justify-between gap-4 sm:flex-row">
                    <TableToolbar search={params.search || ''} params={params} setParams={setParams} setDebounceTime={setDebounceTime} />
                    <Button onClick={() => setOuterOpen(true)}>Tambah</Button>
                </div>
                <CategoryTable category={category} />
            </div>
            <CreateCategory innerOpen={innerOpen} outerOpen={outerOpen} setInnerOpen={setInnerOpen} setOuterOpen={setOuterOpen} />
        </AppLayout>
    );
}
