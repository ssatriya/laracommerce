import { Form, FormField, FormInput, FormItem, FormLabel, FormMessage } from '@/components/form/form';
import ResponsiveDialog from '@/components/responsive-dialog';
import { Button } from '@/components/ui/button';
import { useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import * as React from 'react';
import { toast } from 'sonner';

type FormType = {
    name: string;
};

type Props = {
    innerOpen: boolean;
    outerOpen: boolean;
    setInnerOpen: React.Dispatch<React.SetStateAction<boolean>>;
    setOuterOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const CreateCategory = ({ innerOpen, outerOpen, setInnerOpen, setOuterOpen }: Props) => {
    const form = useForm<Required<FormType>>({
        name: '',
    });

    const { post, data, setData, isDirty, errors, processing, reset, clearErrors } = form;

    React.useEffect(() => {
        if (outerOpen) {
            reset();
            clearErrors();
        }
    }, [outerOpen]);

    const submit: React.FormEventHandler = (e) => {
        e.preventDefault();
        post(route('dashboard.categories.store'), {
            onError: (data) => console.log(data),
            onSuccess: () => {
                toast.success('Kategori berhasil disimpan');
                setOuterOpen(false);
                reset();
            },
        });
    };

    return (
        <ResponsiveDialog
            title="Tambah kategori"
            description="Tambah kategori baru melalui form di bawah ini."
            innerOpen={innerOpen}
            outerOpen={outerOpen}
            setInnerOpen={setInnerOpen}
            setOuterOpen={setOuterOpen}
            isDirty={isDirty}
            className="sm:max-w-lg"
        >
            <Form form={form}>
                <form className="flex flex-col gap-4" onSubmit={submit} method="post">
                    <div className="grid gap-2">
                        <FormField name="name">
                            <FormItem>
                                <FormLabel>Nama Kategori</FormLabel>
                                <FormInput type="text" className="mt-1 block w-full" />
                                <FormMessage />
                            </FormItem>
                        </FormField>
                    </div>
                    <Button type="submit" className="mt-4 w-full" disabled={processing}>
                        {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                        Simpan
                    </Button>
                </form>
            </Form>
        </ResponsiveDialog>
    );
};

export default CreateCategory;
