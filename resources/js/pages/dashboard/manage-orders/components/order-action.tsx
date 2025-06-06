import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import EditOrder from '@/pages/dashboard/manage-orders/components/edit-order';
import { MoreHorizontal, Pencil } from 'lucide-react';
import * as React from 'react';

type Props = {
    id: string;
    status: string;
};

const OrderAction = ({ id, status }: Props) => {
    const [outerOpen, setOuterOpen] = React.useState(false);
    const [innerOpen, setInnerOpen] = React.useState(false);

    return (
        <>
            <DropdownMenu modal={false}>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => setOuterOpen(true)}>
                        <Pencil /> Edit
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <EditOrder id={id} status={status} innerOpen={innerOpen} outerOpen={outerOpen} setInnerOpen={setInnerOpen} setOuterOpen={setOuterOpen} />
        </>
    );
};

export default OrderAction;
