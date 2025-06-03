import SortableImage from '@/components/sortable-image';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { cn, getCroppedImage } from '@/lib/utils';
import { FileWithPreview } from '@/types';
import { closestCenter, DndContext, DragEndEvent, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, rectSortingStrategy, SortableContext } from '@dnd-kit/sortable';
import { router } from '@inertiajs/react';
import * as React from 'react';
import { FileRejection, FileWithPath, useDropzone } from 'react-dropzone';
import Cropper, { type Area, type Point } from 'react-easy-crop';
import { ulid } from 'ulid';

type Props = {
    files: FileWithPreview[];
    setFiles: React.Dispatch<React.SetStateAction<FileWithPreview[]>>;
    error: boolean;
};

const ProductImage = ({ files, setFiles, error }: Props) => {
    const inputRef = React.useRef<React.ComponentRef<'input'>>(null);
    const [cropperOpen, setCropperOpen] = React.useState(false);
    const [crop, setCrop] = React.useState<Point>({ x: 0, y: 0 });
    const [zoom, setZoom] = React.useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = React.useState<Area | null>(null);
    const [rawFiles, setRawFiles] = React.useState<FileWithPreview[]>([]);

    const getFileIds = (files: FileWithPreview[]) => files.map((file) => file.id);

    const sensors = useSensors(useSensor(PointerSensor));

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        if (!over || active.id === over.id) return;

        const oldIndex = files.findIndex((f) => f.id === active.id);
        const newIndex = files.findIndex((f) => f.id === over.id);

        const newFiles = arrayMove(files, oldIndex, newIndex);
        setFiles(newFiles);

        const orderedIds = newFiles.map((file, index) => ({
            id: file.id,
            order: index,
        }));

        router.put(
            route('dashboard.images.reorder'),
            { items: orderedIds },
            {
                preserveScroll: true,
                preserveState: true,
                onError: (errors) => console.error(errors),
            },
        );
    };

    const handleUploadImage = async (file: FileWithPreview) => {
        const formData = new FormData();
        formData.append('image', file);
        formData.append('order', String(files.length));
        formData.append('id', file.id);

        router.post(route('dashboard.images.upload'), formData, {
            forceFormData: true,
            preserveScroll: true,
            preserveState: true,
            onError: (errors) => {
                console.error('Upload error:', errors);
            },
        });
    };

    const onDrop = React.useCallback(
        (acceptedFiles: FileWithPath[], rejectedFiles: FileRejection[]) => {
            setCropperOpen(true);
            console.log(rejectedFiles);
            acceptedFiles.forEach((file) => {
                console.log(files);
                const fileWithPreview = Object.assign(file, {
                    id: ulid(),
                    url: URL.createObjectURL(file),
                });
                setRawFiles((prev) => [...(prev ?? []), fileWithPreview]);
            });
        },
        [setFiles],
    );

    const onCropComplete = (_: Area, croppedPixels: Area) => {
        setCroppedAreaPixels(croppedPixels);
    };

    const handleSaveCrop = async () => {
        if (!croppedAreaPixels || !rawFiles?.[0]) return;

        const croppedBlob = await getCroppedImage(rawFiles[0].url, croppedAreaPixels);
        const croppedFile = new File([croppedBlob], rawFiles[0].name, { type: 'image/jpeg' });

        const fileWithPreview = Object.assign(croppedFile, {
            id: ulid(),
            url: URL.createObjectURL(croppedFile),
        });
        setFiles((prev) => [...(prev ?? []), fileWithPreview]);
        handleUploadImage(fileWithPreview);
        setRawFiles([]);
        setCropperOpen(false);
    };

    const { getRootProps, getInputProps } = useDropzone({
        onDrop,
        noClick: true,
        multiple: false,
    });

    const [isAnimationEnd, setIsAnimationEnd] = React.useState(false);

    return (
        <div>
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <SortableContext items={getFileIds(files)} strategy={rectSortingStrategy}>
                    <div className="grid grid-cols-4 gap-2">
                        {files.map((file) => (
                            <SortableImage
                                key={file.id}
                                file={{
                                    id: file.id,
                                    url: file.url,
                                    alt: file.name,
                                }}
                            />
                        ))}
                        {files.length < 8 && (
                            <div
                                {...getRootProps()}
                                className={cn(
                                    'hover:bg-muted flex max-h-48 cursor-pointer items-center justify-center border border-dashed',
                                    files.length === 0 ? 'col-span-4 h-48' : 'aspect-[3/4]',
                                    error ? 'border-destructive' : 'border-muted-foreground',
                                )}
                                onClick={() => inputRef.current?.click()}
                            >
                                <input {...getInputProps()} ref={inputRef} type="file" className="hidden" />
                                <span className="text-3xl text-white/50">+</span>
                            </div>
                        )}
                    </div>
                </SortableContext>
            </DndContext>
            <Dialog
                open={cropperOpen}
                onOpenChange={(open) => {
                    setCropperOpen(open);
                    if (!open) {
                        setRawFiles([]);
                        if (inputRef.current) {
                            inputRef.current.value = '';
                        }
                    }
                }}
            >
                <DialogContent
                    onAnimationEnd={() => {
                        if (cropperOpen) {
                            setIsAnimationEnd(true);
                        } else {
                            setIsAnimationEnd(false);
                        }
                    }}
                    className="h-[560px] px-8 py-6 sm:max-w-[800px]"
                >
                    <DialogHeader>
                        <DialogTitle>Upload foto baru</DialogTitle>
                        <DialogDescription className="sr-only">Upload foto produk Anda</DialogDescription>
                    </DialogHeader>
                    <div>
                        {rawFiles.length > 0 && isAnimationEnd && (
                            <div className="relative h-[406px] w-full bg-black">
                                <Cropper
                                    image={rawFiles[0].url}
                                    crop={crop}
                                    zoom={zoom}
                                    aspect={3 / 4}
                                    onCropChange={setCrop}
                                    onZoomChange={setZoom}
                                    onCropComplete={onCropComplete}
                                    showGrid={false}
                                    objectFit="contain"
                                />
                            </div>
                        )}
                    </div>
                    <DialogFooter>
                        <Button onClick={handleSaveCrop}>Add</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default ProductImage;
