import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Textarea } from '@/components/ui/textarea';
import { useDebouncedSearch } from '@/hooks/use-debounce-hooks';
import { cn } from '@/lib/utils';
import { SelectOption } from '@/types';
import { usePage } from '@inertiajs/react';
import * as LabelPrimitive from '@radix-ui/react-label';
import { Check, ChevronsUpDown } from 'lucide-react';
import * as React from 'react';

interface TForm extends Record<string, unknown> {}
export type FormContextType = {
    data: TForm;
    setData: <K extends keyof TForm>(key: K, value: TForm[K]) => void;
    errors: Partial<Record<keyof TForm, string>>;
};

const FormContext = React.createContext<FormContextType>({} as FormContextType);

const Form = ({ children, form }: { children: React.ReactNode; form: FormContextType }) => (
    <FormContext.Provider value={form as FormContextType}>{children}</FormContext.Provider>
);

type FormFieldContextValue<TFieldName extends string> = {
    name: TFieldName;
};

const FormFieldContext = React.createContext<FormFieldContextValue<string> | null>(null);

const FormField = <TFieldName extends string>({ name, children }: { name: TFieldName; children: React.ReactNode }) => (
    <FormFieldContext.Provider value={{ name }}>{children}</FormFieldContext.Provider>
);

type FormItemContextValue = { id: string };

const FormItemContext = React.createContext<FormItemContextValue | null>(null);

const FormItem = ({ className, ...props }: React.ComponentProps<'div'>) => {
    const id = React.useId();
    return (
        <FormItemContext.Provider value={{ id }}>
            <div className={cn('space-y-2', className)} {...props} />
        </FormItemContext.Provider>
    );
};

const useFormField = () => {
    const fieldContext = React.useContext(FormFieldContext);
    const itemContext = React.useContext(FormItemContext);
    const form = React.useContext(FormContext);

    if (!fieldContext || !itemContext) {
        throw new Error('useFormField must be used within <FormField> and <FormItem>');
    }

    if (!form) {
        throw new Error('useFormField must be used within <Form>');
    }

    const { name } = fieldContext;
    const { id } = itemContext;

    const value = form.data[name as keyof TForm];
    const setData = form.setData;
    const error = form.errors[name as keyof TForm];

    return {
        id,
        name,
        value,
        setData,
        error,
        formItemId: `${id}-form-item`,
        formDescriptionId: `${id}-form-item-description`,
        formMessageId: `${id}-form-item-message`,
    };
};

const FormLabel = ({ className, ...props }: React.ComponentProps<typeof LabelPrimitive.Root>) => {
    const { formItemId, error } = useFormField();
    return <Label className={cn(error && 'text-destructive', className)} htmlFor={formItemId} {...props} />;
};

const FormInput = (props: React.ComponentProps<'input'>) => {
    const inputRef = React.useRef<HTMLInputElement>(null);
    const { formItemId, formDescriptionId, formMessageId, name, setData, value, error } = useFormField();

    React.useEffect(() => {
        if (error) inputRef.current?.focus();
    }, [error]);

    return (
        <Input
            id={formItemId}
            aria-describedby={error ? `${formDescriptionId} ${formMessageId}` : formDescriptionId}
            aria-invalid={!!error}
            value={value as string}
            onChange={(e) => setData(name, e.target.value)}
            {...props}
            ref={inputRef}
        />
    );
};

const FormTextarea = (props: React.ComponentProps<'textarea'>) => {
    const inputRef = React.useRef<HTMLTextAreaElement>(null);
    const { formItemId, formDescriptionId, formMessageId, name, setData, value, error } = useFormField();
    React.useEffect(() => {
        if (error) inputRef.current?.focus();
    }, [error]);
    return (
        <Textarea
            id={formItemId}
            aria-describedby={error ? `${formDescriptionId} ${formMessageId}` : formDescriptionId}
            aria-invalid={!!error}
            value={value as string}
            onChange={(e) => setData(name, e.target.value)}
            {...props}
            ref={inputRef}
        />
    );
};

type Props = {
    data: SelectOption[];
    route: any;
    only?: string[] | undefined;
    popoverOpen: boolean;
    setPopoverOpen: React.Dispatch<React.SetStateAction<boolean>>;
    selectedValue: string;
    setSelectedValue: React.Dispatch<React.SetStateAction<string>>;
    placeholder: string;
    commandEmpty: string;
};

const FormPopover = ({
    data,
    route,
    only,
    popoverOpen,
    setPopoverOpen,
    selectedValue,
    setSelectedValue,
    placeholder,
    commandEmpty,
    ...props
}: Props & React.ComponentProps<'button'>) => {
    // const [selectedValue, setSelectedValue] = React.useState('');
    const { formDescriptionId, formMessageId, error, setData, value, name } = useFormField();

    const { filters } = usePage().props;
    const { params, setParams, setDebounceTime } = useDebouncedSearch({
        url: route,
        initialParams: filters,
        only: only,
    });

    return (
        <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
            <PopoverTrigger
                aria-describedby={error ? `${formDescriptionId} ${formMessageId}` : formDescriptionId}
                aria-invalid={!!error}
                asChild
                {...props}
            >
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={popoverOpen}
                    className="dark:bg-input/30 w-full justify-between bg-transparent font-normal"
                >
                    {selectedValue ? (
                        data.find((d) => d.value === selectedValue)?.label
                    ) : (
                        <span className="text-muted-foreground">{placeholder}</span>
                    )}
                    <ChevronsUpDown className="opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-(--radix-popover-trigger-width) p-0">
                <Command shouldFilter={false} className="w-full">
                    <CommandInput
                        placeholder={placeholder}
                        value={params.search}
                        onValueChange={(v) => {
                            setParams({ ...params, search: v });
                            setDebounceTime(100);
                        }}
                        className="h-9"
                    />
                    <CommandList className="">
                        <CommandEmpty>{commandEmpty}</CommandEmpty>
                        <CommandGroup className="w-full">
                            {data.map((d) => (
                                <CommandItem
                                    className="w-full"
                                    key={d.value}
                                    value={d.value}
                                    onSelect={(currentValue) => {
                                        setSelectedValue(currentValue === selectedValue ? '' : currentValue);
                                        setData(name, d.value);
                                        setPopoverOpen(false);
                                    }}
                                >
                                    {d.label}
                                    <Check className={cn('ml-auto', selectedValue === d.value ? 'opacity-100' : 'opacity-0')} />
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
};

const FormDescription = ({ className, ...props }: React.ComponentProps<'p'>) => {
    const { formDescriptionId } = useFormField();
    return <p id={formDescriptionId} className={cn('text-muted-foreground text-[0.8rem]', className)} {...props} />;
};

const FormMessage = ({ className, children, ...props }: React.ComponentProps<'p'>) => {
    const { error, formMessageId } = useFormField();
    const body = error ?? children;

    if (!body) return null;

    return (
        <p id={formMessageId} className={cn('text-destructive text-sm', className)} {...props}>
            {body}
        </p>
    );
};

export { Form, FormDescription, FormField, FormInput, FormItem, FormLabel, FormMessage, FormPopover, FormTextarea, useFormField };
