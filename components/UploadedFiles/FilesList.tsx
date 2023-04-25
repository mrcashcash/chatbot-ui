import { FC, useState, useContext, useEffect } from 'react';
import HomeContext from '@/pages/api/home/home.context';
import { VectorStoreInfo } from '@/utils/server/vectorStore';

interface Props {
    name: string;
    index: number | null;
}

export const FilesList: FC<Props> = ({ name, index }) => {
    const {
        state: { selectedVectorStores },
        handleToggleVectorStoreSelection
    } = useContext(HomeContext);
    const [isSelected, setIsSelected] = useState(false);

    const handleFileClick = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        handleToggleVectorStoreSelection(name)
        setIsSelected(!isSelected)
    };

    useEffect(() => {

        setIsSelected(selectedVectorStores.includes(name))
    }, [selectedVectorStores]);
    return (
        <div
            key={name}
            className={`w-full flex items-center justify-center cursor-pointer px-1 py-1 text-sm text-black dark:text-white flex items-center shadow-sm rounded-md ${isSelected ? 'bg-blue-100 dark:bg-blue-600' : 'bg-gray-50 hover:bg-gray-100 dark:bg-[#303133] dark:hover:bg-neutral-600'}`}
            onClick={handleFileClick}
        >
            <div className="font-medium truncate w-full text-center">{name.toUpperCase()}</div>
        </div>
    );
};
