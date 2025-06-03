import { Form, FormField, FormInput, FormItem, FormLabel, FormMessage } from '@/components/form/form';
import ResponsiveDialog from '@/components/responsive-dialog';
import { Button } from '@/components/ui/button';
import { useForm } from '@inertiajs/react';
import * as React from 'react';
import { toast } from 'sonner';

type Props = {
    id: string;
    name: string;
    innerOpen: boolean;
    outerOpen: boolean;
    setInnerOpen: React.Dispatch<React.SetStateAction<boolean>>;
    setOuterOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

type FormType = {
    name: string;
};

const EditCategory = ({ id, name, innerOpen, outerOpen, setInnerOpen, setOuterOpen }: Props) => {
    const form = useForm<Required<FormType>>({
        name: '',
    });

    const { patch, isDirty, reset, clearErrors, setDefaults } = form;

    React.useMemo(() => {
        setDefaults('name', name);
    }, [name]);

    React.useEffect(() => {
        if (outerOpen) {
            reset();
            clearErrors();
        }
    }, [outerOpen]);

    const submit: React.FormEventHandler = (e) => {
        e.preventDefault();
        patch(route('dashboard.categories.update', id), {
            onError: (error) => console.log(error),
            onSuccess: () => {
                toast.success('Kategori berhasil diperbarui');
                setOuterOpen(false);
                reset();
            },
            preserveScroll: true,
            preserveState: true,
        });
    };

    return (
        <ResponsiveDialog
            title="Edit kategori"
            description="Edit kategori melalui form di bawah ini."
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
                                <FormInput type="text" className="mt-1 block w-full" tabIndex={-1} />
                                <FormMessage />
                            </FormItem>
                        </FormField>
                    </div>
                    <Button type="submit">Perbarui</Button>
                </form>
            </Form>
        </ResponsiveDialog>
    );
};

export default EditCategory;
