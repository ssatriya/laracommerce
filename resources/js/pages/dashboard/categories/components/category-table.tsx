import TablePagination from '@/components/data-table/table-pagination';
import TableSortHeader from '@/components/data-table/table-sort-header';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useDebouncedSearch } from '@/hooks/use-debounce-hooks';
import { useSorting } from '@/hooks/use-sorting';
import { formatDateTime } from '@/lib/utils';
import CategoryAction from '@/pages/dashboard/categories/components/category-action';
import { Category, PaginatedData } from '@/types';
import { usePage } from '@inertiajs/react';

type Props = {
    category: PaginatedData<Category>;
};

const CategoryTable = ({ category }: Props) => {
    const { filters } = usePage().props;
    const { params, setParams, setDebounceTime } = useDebouncedSearch({
        url: route('dashboard.categories.index'),
        initialParams: filters,
    });
    const { sort } = useSorting(filters, setParams);

    return (
        <>
            <div className="space-y-6">
                <div className="border-border rounded-md border">
                    <Table>
                        {category.data.length < 1 && (
                            <TableCaption className="mb-4">{params.search ? 'Data tidak ditemukan' : 'Belum ada data kategori'}</TableCaption>
                        )}
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-1/3">
                                    <TableSortHeader
                                        title="Label"
                                        onClick={() => {
                                            setDebounceTime(50);
                                            sort('label');
                                        }}
                                        sort={params.col === 'label' ? params.sort : null}
                                    />
                                </TableHead>
                                <TableHead className="w-1/3">Slug</TableHead>
                                <TableHead className="w-1/3">
                                    <TableSortHeader
                                        title="Tanggal Dibuat"
                                        onClick={() => {
                                            setDebounceTime(50);
                                            sort('createdAt');
                                        }}
                                        sort={params.col === 'createdAt' ? params.sort : null}
                                    />
                                </TableHead>
                                <TableHead className="w-1/4"></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {category.data.map((data) => (
                                <TableRow key={data.id}>
                                    <TableCell className="truncate px-4">{data.label}</TableCell>
                                    <TableCell className="truncate">{data.slug}</TableCell>
                                    <TableCell className="px-4">
                                        {formatDateTime(data.createdAt, {
                                            timeFormatOptions: {
                                                hour: '2-digit',
                                                minute: '2-digit',
                                                hour12: false,
                                            },
                                            timeSeparator: ', ',
                                        })}
                                    </TableCell>
                                    <TableCell>
                                        <CategoryAction categoryId={data.id} categoryLabel={data.label} />
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
                <TablePagination links={category.links} meta={category.meta} />
            </div>
        </>
    );
};

export default CategoryTable;
