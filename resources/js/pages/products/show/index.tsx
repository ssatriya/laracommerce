import Navbar from '@/pages/products/components/navbar';
import Carousel from '@/pages/products/show/components/carousel';
import ProductDetail from '@/pages/products/show/components/product-detail';
import { Product } from '@/types';
import { Head } from '@inertiajs/react';

type Props = {
    product: Product;
};

export default function Index({ product }: Props) {
    return (
        <div className="flex min-h-screen flex-col items-center bg-[#FDFDFC] p-6 text-[#1b1b18] lg:justify-center lg:p-8 dark:bg-[#0a0a0a]">
            <Navbar />
            <div className="flex w-full items-center justify-center opacity-100 transition-opacity duration-750 lg:grow starting:opacity-0">
                <main className="flex w-full flex-col-reverse lg:max-w-7xl lg:flex-row">
                    <div className="h-full w-full">
                        <Head title={product.name}>
                            <link rel="preconnect" href="https://fonts.bunny.net" />
                            <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />
                        </Head>
                        <div className="mx-auto flex max-w-[1400px] flex-col items-center gap-4 px-8 md:flex-row md:justify-center">
                            <div className="w-full max-w-[600px]">
                                <Carousel slides={product.image} />
                            </div>
                            <div className="w-full max-w-[600px]">
                                <ProductDetail product={product} />
                            </div>
                        </div>
                    </div>
                </main>
            </div>
            <div className="hidden h-14.5 lg:block"></div>
        </div>
    );
}
