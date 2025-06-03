import { Params } from '@/types';

export function useSorting(initialParams: Params, setParams: React.Dispatch<React.SetStateAction<Params>>) {
    const sort = (column: string) => {
        setParams((prevParams) => ({
            ...prevParams,
            col: column,
            sort: prevParams.sort === 'asc' ? 'desc' : 'asc',
        }));
    };

    return { sort };
}
