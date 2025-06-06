import Navbar from '@/pages/products/components/navbar';
import ProductList from '@/pages/products/components/product-list';
import { PaginatedData, Product } from '@/types';
import { Head } from '@inertiajs/react';

type Props = {
    product: PaginatedData<Product>;
};

export default function Index({ product }: Props) {
    return (
        <>
            <Head title="Selamat Data di e-commerce">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />
            </Head>
            <div className="flex min-h-screen flex-col items-center bg-[#FDFDFC] p-6 text-[#1b1b18] lg:justify-center lg:p-8 dark:bg-[#0a0a0a]">
                <Navbar />
                <div className="flex w-full items-center justify-center opacity-100 transition-opacity duration-750 lg:grow starting:opacity-0">
                    <main className="flex w-full flex-col-reverse lg:max-w-7xl lg:flex-row">
                        <ProductList product={product} />
                    </main>
                </div>
                <div className="hidden h-14.5 lg:block"></div>
            </div>
        </>
    );
}
