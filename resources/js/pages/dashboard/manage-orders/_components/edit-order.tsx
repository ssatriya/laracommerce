import { Form, FormField, FormItem, FormLabel, FormMessage } from '@/components/form/form';
import ResponsiveDialog from '@/components/responsive-dialog';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useForm } from '@inertiajs/react';
import * as React from 'react';
import { toast } from 'sonner';

type Props = {
    id: string;
    status: string;
    innerOpen: boolean;
    outerOpen: boolean;
    setInnerOpen: React.Dispatch<React.SetStateAction<boolean>>;
    setOuterOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

type FormType = {
    status: string;
};

const EditOrder = ({ id, status, innerOpen, outerOpen, setInnerOpen, setOuterOpen }: Props) => {
    const form = useForm<Required<FormType>>({
        status: '',
    });

    const { data, patch, isDirty, reset, clearErrors, setDefaults, setData } = form;

    React.useMemo(() => {
        setDefaults('status', status);
    }, [status]);

    React.useEffect(() => {
        if (outerOpen) {
            reset();
            clearErrors();
        }
    }, [outerOpen]);

    const submit: React.FormEventHandler = (e) => {
        e.preventDefault();
        patch(route('dashboard.orders.update.status', id), {
            onError: (error) => console.log(error),
            onSuccess: () => {
                toast.success('Status berhasil diperbarui');
                setOuterOpen(false);
                reset();
            },
            preserveScroll: true,
            preserveState: true,
        });
    };

    return (
        <ResponsiveDialog
            title="Edit status"
            description="Edit status pesanan melalui form di bawah ini."
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
                                <Select onValueChange={(value) => setData('status', value)} value={data.status}>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Status pesanan" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="pending">Pending</SelectItem>
                                        <SelectItem value="processing">Processing</SelectItem>
                                        <SelectItem value="completed">Completed</SelectItem>
                                    </SelectContent>
                                </Select>
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

export default EditOrder;
