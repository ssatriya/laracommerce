import { Button } from '@/components/ui/button';
import { useCart } from '@/hooks/use-cart';
import { Link, usePage } from '@inertiajs/react';
import { ShoppingCart } from 'lucide-react';

const Navbar = () => {
    const { auth } = usePage().props;
    const { cart } = useCart();

    console.log(cart);
    return (
        <>
            <header className="mb-6 w-full text-sm not-has-[nav]:hidden lg:max-w-4xl">
                <nav className="flex items-center justify-between gap-4">
                    <Link
                        href={route('products.index')}
                        className="inline-block rounded-sm border border-[#19140035] px-5 py-1.5 text-sm leading-normal text-[#1b1b18] hover:border-[#1915014a] dark:border-[#3E3E3A] dark:text-[#EDEDEC] dark:hover:border-[#62605b]"
                    >
                        Home
                    </Link>
                    <div className="flex gap-4">
                        {auth.user ? (
                            <Link
                                href={route('dashboard.index')}
                                className="inline-block rounded-sm border border-[#19140035] px-5 py-1.5 text-sm leading-normal text-[#1b1b18] hover:border-[#1915014a] dark:border-[#3E3E3A] dark:text-[#EDEDEC] dark:hover:border-[#62605b]"
                            >
                                Dashboard
                            </Link>
                        ) : (
                            <>
                                <Link
                                    href={route('login')}
                                    className="inline-block rounded-sm border border-transparent px-5 py-1.5 text-sm leading-normal text-[#1b1b18] hover:border-[#19140035] dark:text-[#EDEDEC] dark:hover:border-[#3E3E3A]"
                                >
                                    Log in
                                </Link>
                                <Link
                                    href={route('register')}
                                    className="inline-block rounded-sm border border-[#19140035] px-5 py-1.5 text-sm leading-normal text-[#1b1b18] hover:border-[#1915014a] dark:border-[#3E3E3A] dark:text-[#EDEDEC] dark:hover:border-[#62605b]"
                                >
                                    Register
                                </Link>
                            </>
                        )}
                        <div className="ml-5">
                            {cart.items.length > 0 ? (
                                <Button variant="ghost" className="relative p-1" asChild>
                                    <Link href={route('products.cart')}>
                                        <ShoppingCart className="text-primary" />
                                        <div className="absolute top-1 right-1 size-3 rounded-full bg-green-700" />
                                    </Link>
                                </Button>
                            ) : (
                                <Button variant="ghost" className="p-1">
                                    <ShoppingCart className="text-primary" />
                                </Button>
                            )}
                        </div>
                    </div>
                </nav>
            </header>
        </>
    );
};

export default Navbar;
