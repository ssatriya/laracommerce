import TablePagination from '@/components/data-table/table-pagination';
import TableSortHeader from '@/components/data-table/table-sort-header';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useDebouncedSearch } from '@/hooks/use-debounce-hooks';
import { useSorting } from '@/hooks/use-sorting';
import { formatDateTime } from '@/lib/utils';
import ProductAction from '@/pages/dashboard/products/components/product-action';
import { PaginatedData, Product } from '@/types';
import { usePage } from '@inertiajs/react';

type Props = {
    product: PaginatedData<Product>;
};

const ProductTable = ({ product }: Props) => {
    const { filters } = usePage().props;
    const { params, setParams, setDebounceTime } = useDebouncedSearch({
        url: route('dashboard.products.index'),
        initialParams: filters,
    });
    const { sort } = useSorting(filters, setParams);

    return (
        <div className="space-y-6">
            <div className="border-border rounded-md border">
                <Table>
                    {product.data.length < 1 && (
                        <TableCaption className="mb-4">{params.search ? 'Data tidak ditemukan' : 'Belum ada data kategori'}</TableCaption>
                    )}
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-1/6">Gambar</TableHead>
                            <TableHead className="w-1/3">
                                <TableSortHeader
                                    title="Nama Produk"
                                    onClick={() => {
                                        setDebounceTime(50);
                                        sort('name');
                                    }}
                                    sort={params.col === 'name' ? params.sort : null}
                                />
                            </TableHead>
                            <TableHead className="w-1/3">Kategori</TableHead>
                            <TableHead className="w-1/5">
                                <TableSortHeader
                                    title="Harga"
                                    onClick={() => {
                                        setDebounceTime(50);
                                        sort('price');
                                    }}
                                    sort={params.col === 'price' ? params.sort : null}
                                />
                            </TableHead>
                            <TableHead className="w-1/5">
                                <TableSortHeader
                                    title="Kuantitas"
                                    onClick={() => {
                                        setDebounceTime(50);
                                        sort('quantity');
                                    }}
                                    sort={params.col === 'quantity' ? params.sort : null}
                                />
                            </TableHead>
                            <TableHead className="w-1/4">Deskripsi</TableHead>
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
                        {product.data.map((data) => (
                            <TableRow key={data.id}>
                                <TableCell className="truncate px-4">
                                    <img className="aspect-[3/4] h-20" src={data.image[0].path} alt={data.image[0].filename} />
                                </TableCell>
                                <TableCell className="truncate px-4">{data.name}</TableCell>
                                <TableCell className="truncate">{data.category.label}</TableCell>
                                <TableCell className="truncate px-4">{data.price}</TableCell>
                                <TableCell className="truncate px-4">{data.quantity}</TableCell>
                                <TableCell className="max-w-[300px] truncate">{data.description}</TableCell>
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
                                    <ProductAction productId={data.id} />
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
            <TablePagination links={product.links} meta={product.meta} />
        </div>
    );
};

export default ProductTable;
