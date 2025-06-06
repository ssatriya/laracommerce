import Thumbnail from '@/pages/products/show/components/thumbnail';
import { EmblaOptionsType } from 'embla-carousel';
import useEmblaCarousel from 'embla-carousel-react';
import * as React from 'react';

type Props = {
    slides: Array<{
        id: string;
        filename: string;
        path: string;
    }>;
    options?: EmblaOptionsType;
};

const Carousel = ({ slides, options }: Props) => {
    const [selectedIndex, setSelectedIndex] = React.useState(0);
    const [emblaMainRef, emblaMainApi] = useEmblaCarousel(options);
    const [emblaThumbsRef, emblaThumbsApi] = useEmblaCarousel({
        containScroll: 'keepSnaps',
        dragFree: true,
        axis: 'x',
    });

    const onThumbClick = React.useCallback(
        (index: number) => {
            if (!emblaMainApi || !emblaThumbsApi) return;
            emblaMainApi.scrollTo(index);
            emblaThumbsApi.scrollTo(index); // Sync both carousels
        },
        [emblaMainApi, emblaThumbsApi],
    );

    const onSelect = React.useCallback(() => {
        if (!emblaMainApi || !emblaThumbsApi) return;
        const newIndex = emblaMainApi.selectedScrollSnap();
        setSelectedIndex(newIndex);
        emblaThumbsApi.scrollTo(newIndex);
    }, [emblaMainApi, emblaThumbsApi]);

    // Initialize and cleanup
    React.useEffect(() => {
        if (!emblaMainApi) return;

        emblaMainApi.on('select', onSelect);

        return () => {
            emblaMainApi.off('select', onSelect);
        };
    }, [emblaMainApi, onSelect]);

    // Reinitialize when slides change
    React.useEffect(() => {
        if (emblaMainApi) emblaMainApi.reInit();
        if (emblaThumbsApi) emblaThumbsApi.reInit();
    }, [slides]);

    return (
        <div>
            <div className="mx-auto max-w-3xl">
                <div className="overflow-hidden" ref={emblaMainRef}>
                    <div ref={emblaMainRef} className="-ml-4 flex touch-pan-y touch-pinch-zoom">
                        {slides.map((slide, index) => (
                            <div key={index} className="min-w-0 flex-[0_0_100%] transform-gpu pl-4">
                                <img src={slide.path} alt={slide.filename} className="aspect-[3/4] h-auto max-w-[500px] rounded-2xl" />
                            </div>
                        ))}
                    </div>
                </div>
                <div className="mt-3">
                    <div className="overflow-hidden">
                        <div ref={emblaThumbsRef} className="-ml-3 flex flex-row">
                            {slides.map((slide, index) => (
                                <Thumbnail
                                    key={index}
                                    onClick={() => onThumbClick(index)}
                                    selected={index === selectedIndex}
                                    index={index}
                                    path={slide.path}
                                    filename={slide.filename}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Carousel;
