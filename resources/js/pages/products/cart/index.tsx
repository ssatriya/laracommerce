import Navbar from '@/pages/products/_components/navbar';
import CartDetail from '@/pages/products/cart/_components/cart-detail';
import { Head } from '@inertiajs/react';

const Index = () => {
    return (
        <>
            <Head title="Keranjang Anda">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />
            </Head>
            <div className="flex min-h-screen flex-col items-center bg-[#FDFDFC] p-6 text-[#1b1b18] lg:justify-center lg:p-8 dark:bg-[#0a0a0a]">
                <Navbar />
                <div className="flex w-full items-center justify-center opacity-100 transition-opacity duration-750 lg:grow starting:opacity-0">
                    <main className="flex w-full flex-col-reverse lg:max-w-7xl lg:flex-row">
                        <CartDetail />
                    </main>
                </div>
                <div className="hidden h-14.5 lg:block"></div>
            </div>
        </>
    );
};

export default Index;
