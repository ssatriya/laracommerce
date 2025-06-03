import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

type Props = {
    file: {
        id: string;
        url: string;
        alt: string;
    };
};

const SortableImage = ({ file }: Props) => {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: file.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <img
            ref={setNodeRef}
            {...attributes}
            {...listeners}
            src={file.url}
            alt={file.alt}
            style={style}
            className="aspect-[3/4] max-h-48 w-full object-cover"
        />
    );
};

export default SortableImage;
