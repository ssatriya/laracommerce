import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ArrowDownIcon, ArrowUpIcon, ChevronsUpDownIcon } from 'lucide-react';

type Sort = 'desc' | 'asc' | null | undefined;

const SortIcon = ({ sort }: { sort: Sort }) => {
    if (sort === 'desc') return <ArrowDownIcon className="ml-2 size-3.5" />;
    if (sort === 'asc') return <ArrowUpIcon className="ml-2 size-3.5" />;
    return <ChevronsUpDownIcon className="ml-2 size-3.5" />;
};

type Props = {
    className?: string;
    title: string;
    sort?: Sort;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

const TableSortHeader = ({ title, sort, className, ...props }: Props) => {
    return (
        <div className={cn('flex items-center space-x-2', className)}>
            <Button variant="ghost" size="sm" className="-ml-0.5 flex items-center border-none" {...props}>
                <span>{title}</span>
                <SortIcon sort={sort} />
            </Button>
        </div>
    );
};

export default TableSortHeader;
