import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { PaginatedLink, PaginatedMeta } from '@/types';
import { Link } from '@inertiajs/react';
import { ChevronLeftIcon, ChevronRightIcon, ChevronsLeftIcon, ChevronsRightIcon, LucideIcon } from 'lucide-react';

type Props = {
    links: PaginatedLink;
    meta: PaginatedMeta;
};

const TablePagination = ({ links, meta }: Props) => {
    return (
        <div className="flex items-center justify-between">
            <div className="hidden md:block">
                <p className="text-sm tabular-nums">
                    Menampilkan <span className="font-bold">{meta.from || 0}</span> sampai <span className="font-bold">{meta.to || 0}</span> dari{' '}
                    <span className="font-bold">{meta.total}</span> data
                </p>
            </div>
            <div className="block space-x-1 md:hidden">
                <PaginationLink href={links.first} srText="Go to first page" icon={ChevronsLeftIcon} disabled={meta.current_page === 1} />
                <PaginationLink href={links.prev} srText="Go to previous page" icon={ChevronLeftIcon} disabled={meta.current_page === 1} />
            </div>
            <div className="text-sm tabular-nums">
                Halaman <span className="font-bold">{meta.current_page}</span> dari <span className="font-bold">{meta.last_page}</span>
            </div>
            <div className="flex items-center space-x-2">
                <PaginationLink href={links.first} srText="Go to first page" icon={ChevronsLeftIcon} hiddenOnMd disabled={meta.current_page === 1} />
                <PaginationLink href={links.prev} srText="Go to previous page" icon={ChevronLeftIcon} hiddenOnMd disabled={meta.current_page === 1} />
                <PaginationLink href={links.next} srText="Go to next page" icon={ChevronRightIcon} disabled={meta.current_page === meta.last_page} />
                <PaginationLink href={links.last} srText="Go to last page" icon={ChevronsRightIcon} disabled={meta.current_page === meta.last_page} />
            </div>
        </div>
    );
};

export default TablePagination;

const PaginationLink = ({
    href,
    srText,
    icon: Icon,
    hiddenOnMd,
    disabled = false,
}: {
    href: string | null;
    srText: string;
    icon: LucideIcon;
    hiddenOnMd?: boolean;
    disabled?: boolean;
}) => (
    <Button
        variant="secondary"
        size="sm"
        className={cn(hiddenOnMd ? 'hidden md:inline-flex' : '', disabled ? 'cursor-not-allowed opacity-50' : '')}
        asChild
        disabled={disabled || !href}
    >
        <Link preserveScroll preserveState href={href ? href : '#'}>
            <span className="sr-only">{srText}</span>
            <Icon className="h-4 w-4" />
        </Link>
    </Button>
);
