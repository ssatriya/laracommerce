import { LucideIcon } from 'lucide-react';
import { FileWithPath } from 'react-dropzone';
import type { Config } from 'ziggy-js';

type Role = 'user' | 'admin';

export interface Auth {
    user: User;
    role: Role;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    href: string;
    icon?: LucideIcon | null;
    isActive?: boolean;
    roles: Array<Role>;
}

export interface SharedData {
    auth: Auth;
    ziggy: Config & { location: string };
    sidebarOpen: boolean;
    filters: Filter;
    [key: string]: unknown;
}

export interface User {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
    [key: string]: unknown; // This allows for additional properties...
}

export interface Filter {
    search?: string;
    limit?: string;
    col?: string;
    sort?: 'asc' | 'desc';
    filters?: Record<string, string> | string;
}

export interface Params {
    search?: string;
    limit?: string;
    col?: string;
    sort?: 'asc' | 'desc';
    filters?: Record<string, string> | string;
    [key: string]: any;
}

export type PaginatedLink = {
    first: string;
    last: string;
    prev: string | null;
    next: string | null;
};

export type PaginatedMeta = {
    current_page: number;
    from: number;
    last_page: number;
    links: Array<Link>;
    path: string;
    per_page: number;
    to: number;
    total: number;
};

export type PaginatedData<T> = {
    data: T[];
    links: PaginatedLink;
    meta: PaginatedMeta;
};

export type Category = {
    id: string;
    label: string;
    slug: string;
    createdAt: string;
};

export type Product = {
    id: string;
    name: string;
    slug: string;
    price: string;
    quantity: string;
    description: string;
    image: Array<{
        id: string;
        filename: string;
        path: string;
    }>;
    category: { id: string; label: string; slug: string };
    createdAt: string;
};

export type FileWithPreview = FileWithPath & {
    url: string;
    id: string;
};

export type SelectOption = {
    value: string;
    label: string;
};

export type CartItem = {
    id: string;
    name: string;
    images: Array<{
        id: string;
        filename: string;
        path: string;
    }>;
    quantity: number;
    price: string;
};

export type Cart = {
    userId: number | null;
    items: CartItem[];
};
