import { SharedData as AppPageProps } from '@/types/index';
import { PageProps as InertiaPageProps } from '@inertiajs/core';
import type { route as routeFn } from 'ziggy-js';

declare global {
    const route: typeof routeFn;
}

declare module '@inertiajs/core' {
    interface PageProps extends InertiaPageProps, AppPageProps {}
}
