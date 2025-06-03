type Props = {
    onClick: () => void;
    selected: boolean;
    index: number;
    path: string;
    filename: string;
};

const Thumbnail = ({ onClick, selected, index, path, filename }: Props) => {
    return (
        <div className="min-w-0 flex-[0_0_22%] pl-3 sm:flex-[0_0_15%]" onClick={onClick}>
            <img src={path} alt={filename} className="rounded-xl" />
        </div>
    );
};

export default Thumbnail;
