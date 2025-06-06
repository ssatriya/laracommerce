import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useCart } from '@/hooks/use-cart';
import { formatCurrency } from '@/lib/utils';
import { Link, router, useForm, usePage } from '@inertiajs/react';
import { CreditCard, Minus, Package, Plus, Shield, Trash2, Truck } from 'lucide-react';
import * as React from 'react';

type LoginType = {
    userId: string;
    totalPrice: number;
    shippingAddress: string;
    productList: Array<{
        id: string;
        quantity: number;
    }>;
};

const CartDetail = () => {
    const { cart, totalPrice, removeItem, updateQuantity, clearCart } = useCart();
    const { auth } = usePage().props;

    const handlerRemoveItem = (id: string) => {
        removeItem(id);
        router.get(
            route('products.index'),
            {},
            {
                replace: true,
            },
        );
    };

    const productList = cart.items.map((item) => ({ id: item.id, quantity: item.quantity }));

    const { data, setData, post } = useForm<Required<LoginType>>({
        userId: auth.user ? auth.user.id : '',
        totalPrice: totalPrice,
        shippingAddress: '',
        productList: productList,
    });

    const submit: React.FormEventHandler = (e) => {
        e.preventDefault();
        post(route('order'), {
            onFinish: () => {},
            onSuccess: () => {
                clearCart();
            },
        });
    };

    return (
        <div className="mx-auto w-full max-w-7xl p-6">
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                {/* Main Cart Section */}
                <div className="space-y-6 lg:col-span-2">
                    <div>
                        <h1 className="text-primary text-2xl font-semibold">Shopping Cart</h1>
                        <p className="text-muted-foreground">
                            {cart.items.length} {cart.items.length === 1 ? 'item' : 'items'} in your cart
                        </p>
                    </div>

                    <div className="space-y-4">
                        {cart.items.map((item) => (
                            <Card key={item.id} className="overflow-hidden p-0">
                                <CardContent className="p-0">
                                    <div className="flex h-full flex-col md:flex-row">
                                        {/* Product Image */}
                                        <div className="relative h-auto w-full md:w-32">
                                            <img src={item.images[0].path} alt={item.images[0].filename} className="h-[13 0px] aspect-[3/4] w-auto" />
                                        </div>

                                        {/* Product Details */}
                                        <div className="flex-1 p-6 pb-3">
                                            <div className="flex justify-between">
                                                <div>
                                                    <h3 className="font-medium">{item.name}</h3>
                                                </div>
                                                <Button variant="ghost" size="icon" onClick={() => handlerRemoveItem(item.id)}>
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>

                                            <div className="mt-4 flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <Button variant="outline" size="icon" onClick={() => updateQuantity(item.id, -1)}>
                                                        <Minus className="h-4 w-4" />
                                                    </Button>
                                                    <span className="w-8 text-center">{item.quantity}</span>
                                                    <Button variant="outline" size="icon" onClick={() => updateQuantity(item.id, 1)}>
                                                        <Plus className="h-4 w-4" />
                                                    </Button>
                                                </div>

                                                <div className="text-right">
                                                    <div className="font-medium">{formatCurrency(Number(item.price) * item.quantity)}</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>

                {/* Order Summary */}
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Order Summary</CardTitle>
                            <CardDescription>Review your order details and shipping information</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {/* Order Summary */}
                            <form onSubmit={submit}>
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span>Subtotal</span>
                                        <span>{formatCurrency(totalPrice)}</span>
                                    </div>
                                </div>

                                {/* Features */}
                                <div className="space-y-4 border-t py-4">
                                    <div className="flex items-center gap-2 text-sm">
                                        <Package className="text-primary h-4 w-4" />
                                        <span>Free returns within 30 days</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm">
                                        <Shield className="text-primary h-4 w-4" />
                                        <span>Secure payment</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm">
                                        <Truck className="text-primary h-4 w-4" />
                                        <span>Fast delivery</span>
                                    </div>

                                    <Input
                                        required
                                        name="shipping_address"
                                        placeholder="Alamat tujuan"
                                        value={data.shippingAddress}
                                        onChange={(e) => setData('shippingAddress', e.target.value)}
                                    />
                                </div>

                                {/* Checkout Button */}
                                {auth.user ? (
                                    <Button type="submit" className="w-full">
                                        Lanjutkan ke Pembayaran
                                    </Button>
                                ) : (
                                    <Button className="w-full" asChild>
                                        <Link href={auth.user ? '' : route('login')}>
                                            <CreditCard className="mr-2 h-4 w-4" />
                                            Lanjutkan ke Pembayaran
                                        </Link>
                                    </Button>
                                )}
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default CartDetail;
