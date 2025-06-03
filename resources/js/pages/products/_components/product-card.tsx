import { Link } from '@inertiajs/react';

type Props = {
    name: string;
    slug: string;
    price: string;
    images: Array<{
        id: string;
        filename: string;
        path: string;
    }>;
};

const ProductCard = ({ slug, name, price, images }: Props) => {
    return (
        <Link href={route('products.show', slug)} className="flex flex-col flex-wrap gap-4">
            <div className="group relative aspect-[3/4] w-[280px] overflow-hidden rounded-2xl">
                <img
                    src={images[0].path}
                    alt={images[0].filename}
                    className="absolute inset-0 h-full w-full object-cover opacity-100 transition-opacity duration-300 group-hover:opacity-0"
                />
                <img
                    src={images[1].path}
                    alt={images[1].filename}
                    className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                />
            </div>
            <div className="text-primary flex w-[310px] flex-col gap-2">
                <h3 className="text-2xl font-bold break-words">{name}</h3>
                <span className="font-medium">Rp. {price}</span>
            </div>
        </Link>
    );
};

export default ProductCard;
