import { FileWithPreview } from '@/types';
import { type ClassValue, clsx } from 'clsx';
import { type Area } from 'react-easy-crop';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

type FormatDateTimeOptions = {
    locale?: string;
    dateFormatOptions?: Intl.DateTimeFormatOptions;
    timeFormatOptions?: Intl.DateTimeFormatOptions;
    timeSeparator?: string;
};

export function formatDateTime(
    dateInput: Date | string | number,
    {
        locale = 'id-ID',
        dateFormatOptions = { year: 'numeric', month: 'long', day: '2-digit' },
        timeFormatOptions,
        timeSeparator = ' ',
    }: FormatDateTimeOptions = {},
): string {
    const date = typeof dateInput === 'string' || typeof dateInput === 'number' ? new Date(dateInput) : dateInput;

    if (isNaN(date.getTime())) return 'Invalid date';

    const dateString = new Intl.DateTimeFormat(locale, dateFormatOptions).format(date);

    if (timeFormatOptions) {
        const timeString = new Intl.DateTimeFormat(locale, timeFormatOptions).format(date);
        return `${dateString}${timeSeparator}${timeString}`;
    }

    return dateString;
}

export async function getCroppedImage(imageSrc: string, pixelCrop: Area): Promise<Blob> {
    const image = await createImage(imageSrc);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Canvas context not available');

    canvas.width = pixelCrop.width;
    canvas.height = pixelCrop.height;

    ctx.drawImage(image, pixelCrop.x, pixelCrop.y, pixelCrop.width, pixelCrop.height, 0, 0, pixelCrop.width, pixelCrop.height);

    return new Promise((resolve, reject) => {
        canvas.toBlob((blob) => {
            if (blob) resolve(blob);
            else reject(new Error('Canvas is empty'));
        }, 'image/jpeg');
    });
}

function createImage(url: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.addEventListener('load', () => resolve(img));
        img.addEventListener('error', (err) => reject(err));
        img.src = url;
    });
}

type BackendImage = {
    id: string;
    filename: string;
    path: string;
};

export const mockFileWithPreview = (image: BackendImage): FileWithPreview => {
    const dummy = new Blob(); // just a fake body
    const fakeFile = new File([dummy], image.filename, {
        type: 'image/jpeg', // or infer from name
        lastModified: Date.now(),
    });

    return Object.assign(fakeFile, {
        id: image.id,
        url: image.path, // use 'url' directly as preview
        path: undefined,
        handle: undefined,
        relativePath: undefined,
    });
};

export function formatCurrency(amount: number): string {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 2,
    }).format(amount);
}
