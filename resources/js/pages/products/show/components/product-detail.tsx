import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useCart } from '@/hooks/use-cart';
import { Product } from '@/types';
import * as React from 'react';

type Props = {
    product: Product;
};

const ProductDetail = ({ product }: Props) => {
    const { addItem } = useCart();
    const [quantity, setQuantity] = React.useState(1);

    const handleAddItem = () => {
        addItem({ productId: product.id, name: product.name, images: product.image, price: product.price, quantity: quantity });
    };

    return (
        <div className="text-primary flex flex-col gap-8">
            <h2 className="text-3xl font-bold text-pretty">{product.name}</h2>
            <div className="flex flex-col gap-3">
                <span className="font-bold">Rp {product.price}</span>
                <p className="text-muted-foreground leading-4 font-medium whitespace-pre">{product.description}</p>
            </div>
            <div className="flex gap-6">
                <Input
                    type="number"
                    min={1}
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    name="quantity"
                    className="max-w-[100px]"
                />
                <Button onClick={handleAddItem}>Tambah ke Keranjang</Button>
            </div>
        </div>
    );
};

export default ProductDetail;
