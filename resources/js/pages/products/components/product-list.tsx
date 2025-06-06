import ProductCard from '@/pages/products/components/product-card';
import { PaginatedData, Product } from '@/types';

type Props = {
    product: PaginatedData<Product>;
};

const ProductList = ({ product }: Props) => {
    return (
        <div className="flex flex-wrap gap-4">
            {product.data.map((data) => (
                <ProductCard key={data.id} slug={data.slug} name={data.name} price={data.price} images={data.image} />
            ))}
        </div>
    );
};

export default ProductList;
