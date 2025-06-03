import TablePagination from '@/components/data-table/table-pagination';
import TableSortHeader from '@/components/data-table/table-sort-header';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useDebouncedSearch } from '@/hooks/use-debounce-hooks';
import { useSorting } from '@/hooks/use-sorting';
import { formatDateTime } from '@/lib/utils';
import { Order, PaginatedData } from '@/types';
import { usePage } from '@inertiajs/react';

type Props = {
    order: PaginatedData<Order>;
};

const OrderTable = ({ order }: Props) => {
    const { filters } = usePage().props;
    const { params, setParams, setDebounceTime } = useDebouncedSearch({
        url: route('dashboard.orders.user.orders'),
        initialParams: filters,
    });
    const { sort } = useSorting(filters, setParams);

    return (
        <div className="space-y-6">
            <div className="border-border rounded-md border">
                <Table>
                    {order.data.length < 1 && (
                        <TableCaption className="mb-4">{params.search ? 'Data tidak ditemukan' : 'Belum ada data kategori'}</TableCaption>
                    )}
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-1/3">
                                <TableSortHeader
                                    title="ID"
                                    onClick={() => {
                                        setDebounceTime(50);
                                        sort('id');
                                    }}
                                    sort={params.col === 'id' ? params.sort : null}
                                />
                            </TableHead>
                            <TableHead className="w-1/3">
                                <TableSortHeader
                                    title="Status"
                                    onClick={() => {
                                        setDebounceTime(50);
                                        sort('status');
                                    }}
                                    sort={params.col === 'status' ? params.sort : null}
                                />
                            </TableHead>
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
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {order.data.map((data) => (
                            <TableRow key={data.id}>
                                <TableCell className="truncate px-4">{data.id}</TableCell>
                                <TableCell className="truncate px-4">{data.status}</TableCell>
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
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
            <TablePagination links={order.links} meta={order.meta} />
        </div>
    );
};

export default OrderTable;
