import { Form, FormField, FormInput, FormItem, FormLabel, FormMessage, FormPopover, FormTextarea } from '@/components/form/form';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import ProductImage from '@/pages/dashboard/products/create/components/product-image';
import { FileWithPreview, SelectOption } from '@/types';
import { useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
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
    categories: SelectOption[];
};

const CreateProduct = ({ categories }: Props) => {
    const [selectedValue, setSelectedValue] = React.useState('');
    const [popoverOpen, setPopoverOpen] = React.useState(false);
    const [files, setFiles] = React.useState<FileWithPreview[]>([]);
    const form = useForm<Required<FormType>>({
        name: '',
        price: '',
        quantity: 0,
        description: '',
        images: [],
        categoryId: '',
    });

    const { post, setData, errors, processing, reset } = form;

    React.useEffect(() => {
        if (files) {
            const ids = files.map((file) => file.id);
            setData('images', ids);
        }
    }, [files]);

    const submit: React.FormEventHandler = (e) => {
        e.preventDefault();
        post(route('dashboard.products.store'), {
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
            <Heading title="Detail Produk" />
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
                                    route={route('dashboard.products.create')}
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
                                <ProductImage error={!!errors.images} files={files} setFiles={setFiles} />
                                <InputError message={errors.images} />
                            </FormItem>
                        </FormField>
                    </div>
                    <Button type="submit" className="mt-4 w-full" disabled={processing}>
                        {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                        Simpan
                    </Button>
                </form>
            </Form>
        </div>
    );
};

export default CreateProduct;
