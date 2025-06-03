import { usePrevious } from '@/hooks/use-previous';
import { Params } from '@/types';
import { router } from '@inertiajs/react';
import { debounce, pickBy } from 'lodash-es';
import * as React from 'react';

export function useDebouncedSearch({
    url,
    initialParams,
    initialDebounceTime = 50,
    only = [],
}: {
    url: string;
    initialParams: Params;
    initialDebounceTime?: number;
    only?: string[];
}) {
    const [params, setParams] = React.useState<Params>(initialParams);
    const [isLoading, setIsLoading] = React.useState(false);
    const [debounceTime, setDebounceTime] = React.useState<number>(initialDebounceTime);
    const prevParams = usePrevious(params);

    const search = React.useCallback(
        debounce((params: Params) => {
            router.get(url, pickBy(params), {
                replace: true,
                preserveScroll: true,
                preserveState: true,
                queryStringArrayFormat: 'indices',
                onStart: () => setIsLoading(true),
                onFinish: () => setIsLoading(false),
                only: only,
            });
        }, debounceTime),
        [debounceTime, url],
    );

    React.useEffect(() => {
        if (prevParams) {
            search(params);
        }
    }, [params, prevParams, search]);

    return { params, setParams, setDebounceTime, isLoading };
}
