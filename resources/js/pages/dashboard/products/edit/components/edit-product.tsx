import { Form, FormField, FormInput, FormItem, FormLabel, FormMessage, FormPopover, FormTextarea } from '@/components/form/form';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { mockFileWithPreview } from '@/lib/utils';
import EditProductImage from '@/pages/dashboard/products/create/components/edit-product-image';
import { FileWithPreview, Product, SelectOption } from '@/types';
import { useForm } from '@inertiajs/react';
import * as React from 'react';
import { toast } from 'sonner';

type FormType = {
    name: string;
    price: string;
    quantity: number;
    description: string;
    images: string[];
    categoryId: string;
};

type Props = {
    product: Product;
    categories: SelectOption[];
};

const EditProduct = ({ product, categories }: Props) => {
    const defaultFiles: FileWithPreview[] = product.image.map(mockFileWithPreview);
    const [selectedValue, setSelectedValue] = React.useState(product.category.id);
    const [popoverOpen, setPopoverOpen] = React.useState(false);
    const [files, setFiles] = React.useState<FileWithPreview[]>(defaultFiles);
    const form = useForm<Required<FormType>>({
        name: product.name,
        price: product.price,
        quantity: Number(product.quantity),
        description: product.description,
        images: [],
        categoryId: selectedValue,
    });

    const { patch, setData, errors, processing, data, reset } = form;

    React.useEffect(() => {
        if (files) {
            const ids = files.map((file) => file.id);
            setData('images', ids);
        }
    }, [files]);

    const submit: React.FormEventHandler = (e) => {
        e.preventDefault();
        patch(route('dashboard.products.update', product.id), {
            onError: (error) => {
                console.log(error);
                toast.error('Produk gagal disimpan');
            },
            onSuccess: () => {
                toast.success('Produk berhasil disimpan');
                reset();
            },
        });
    };

    return (
        <div>
            <Heading title="Edit Produk" />
            <Form form={form}>
                <form className="flex flex-col gap-4" onSubmit={submit} method="post">
                    <div className="grid gap-2">
                        <FormField name="name">
                            <FormItem>
                                <FormLabel>Nama Produk</FormLabel>
                                <FormInput tabIndex={0} type="text" className="mt-1 block w-full" />
                                <FormMessage />
                            </FormItem>
                        </FormField>
                    </div>
                    <div className="grid gap-2">
                        <FormField name="categoryId">
                            <FormItem>
                                <FormLabel>Kategori</FormLabel>
                                <FormPopover
                                    data={categories}
                                    route={route('dashboard.products.edit', product.id)}
                                    popoverOpen={popoverOpen}
                                    setPopoverOpen={setPopoverOpen}
                                    selectedValue={selectedValue}
                                    setSelectedValue={setSelectedValue}
                                    placeholder="Cari kategori"
                                    commandEmpty="Kategori tidak ditemukan"
                                    tabIndex={1}
                                />
                                <FormMessage />
                            </FormItem>
                        </FormField>
                    </div>
                    <div className="grid gap-2">
                        <FormField name="price">
                            <FormItem>
                                <FormLabel>Harga</FormLabel>
                                <FormInput type="text" className="mt-1 block w-full" />
                                <FormMessage />
                            </FormItem>
                        </FormField>
                    </div>
                    <div className="grid gap-2">
                        <FormField name="quantity">
                            <FormItem>
                                <FormLabel>Kuantitas</FormLabel>
                                <FormInput type="number" className="mt-1 block w-full" />
                                <FormMessage />
                            </FormItem>
                        </FormField>
                    </div>
                    <div className="grid gap-2">
                        <FormField name="description">
                            <FormItem>
                                <FormLabel>Deskripsi</FormLabel>
                                <FormTextarea className="mt-1 block w-full" />
                                <FormMessage />
                            </FormItem>
                        </FormField>
                    </div>
                    <div className="grid gap-2">
                        <FormField name="image">
                            <FormItem>
                                <FormLabel>Gambar</FormLabel>
                                <EditProductImage error={!!errors.images} files={files} setFiles={setFiles} productId={product.id} />
                                <InputError message={errors.images} />
                            </FormItem>
                        </FormField>
                    </div>
                    <Button type="submit">Simpan</Button>
                </form>
            </Form>
        </div>
    );
};

export default EditProduct;
