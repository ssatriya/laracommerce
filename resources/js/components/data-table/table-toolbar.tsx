import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { Params } from '@/types';

type Props = {
    search: string;
    params: Params;
    setParams: React.Dispatch<React.SetStateAction<Params>>;
    setDebounceTime: React.Dispatch<React.SetStateAction<number>>;
};

const TableToolbar = ({ params, setParams, setDebounceTime }: Props) => {
    return (
        <div className="flex w-full gap-3">
            <Input
                placeholder="Cari..."
                className="w-full sm:max-w-xs"
                value={params.search || ''}
                onChange={(e) => {
                    setParams({ ...params, search: e.target.value });
                    setDebounceTime(500);
                }}
            />

            <Button
                onClick={() => {
                    if (params.search && params.sort && params.col) {
                        setParams({ ...params, search: '', sort: undefined, col: undefined });
                    } else if (params.sort) {
                        setParams({ ...params, sort: undefined, col: undefined });
                    } else if (params.search) {
                        setParams({ ...params, search: '' });
                    }
                }}
                variant="outline"
                className={cn(params.search || params.sort ? 'opacity-100' : 'opacity-0')}
            >
                Reset
            </Button>
        </div>
    );
};

export default TableToolbar;
