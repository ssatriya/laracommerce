import { Cart } from '@/types';
import { usePage } from '@inertiajs/react';
import * as React from 'react';

const CART_KEY = 'ecommerce_cart';

const loadCart = (): Cart => {
    const raw = localStorage.getItem(CART_KEY);
    try {
        return raw ? JSON.parse(raw) : { userId: null, items: [] };
    } catch {
        return { userId: null, items: [] };
    }
};

const saveCart = (cart: Cart) => {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
};

export const useCart = () => {
    const { props } = usePage();
    const user = props.auth?.user || null;

    const [cart, setCart] = React.useState<Cart>(() => {
        const initial = loadCart();
        return { ...initial, userId: user?.id || null };
    });

    React.useEffect(() => {
        saveCart(cart);
    }, [cart]);

    const addItem = React.useCallback(
        ({
            productId,
            name,
            images,
            price,
            quantity = 1,
        }: {
            productId: string;
            name: string;
            images: Array<{
                id: string;
                filename: string;
                path: string;
            }>;
            price: string;
            quantity: number;
        }) => {
            setCart((prevCart) => {
                const items = [...prevCart.items];
                const existingIndex = items.findIndex((item) => item.id === productId);

                if (existingIndex !== -1) {
                    items[existingIndex].quantity += quantity;
                } else {
                    items.push({ id: productId, name, images, price, quantity });
                }

                return { ...prevCart, userId: user?.id || null, items };
            });
        },
        [user],
    );

    const updateQuantity = React.useCallback((productId: string, value: 1 | -1) => {
        setCart((prevCart) => {
            const items = prevCart.items.map((item) => {
                if (item.id === productId) {
                    const newQuantity = item.quantity + value;
                    return {
                        ...item,
                        quantity: newQuantity < 1 ? 1 : newQuantity,
                    };
                }
                return item;
            });

            return { ...prevCart, items };
        });
    }, []);

    const updateItem = React.useCallback(({ productId, quantity }: { productId: string; quantity: number }) => {
        setCart((prevCart) => {
            const items = prevCart.items.map((item) => (item.id === productId ? { ...item, quantity } : item));
            return { ...prevCart, items };
        });
    }, []);

    const removeItem = React.useCallback((productId: string) => {
        setCart((prevCart) => ({
            ...prevCart,
            items: prevCart.items.filter((item) => item.id !== productId),
        }));
    }, []);

    const clearCart = React.useCallback(() => {
        setCart({ userId: user?.id || null, items: [] });
    }, [user]);

    const totalPrice = React.useMemo(() => {
        return cart.items.reduce((total, item) => {
            const price = parseFloat(item.price) || 0;
            return total + price * item.quantity;
        }, 0);
    }, [cart.items]);

    return {
        cart,
        totalPrice,
        addItem,
        updateQuantity,
        removeItem,
        updateItem,
        clearCart,
    };
};
