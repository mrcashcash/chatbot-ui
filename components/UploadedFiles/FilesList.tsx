import { FC, useState, useContext } from 'react';
import HomeContext from '@/pages/api/home/home.context';
import { VectorStoreInfo } from '@/utils/server/vectorStore';

interface Props {
    vs: VectorStoreInfo;
    index: number | null;
}

export const FilesList: FC<Props> = ({ vs, index }) => {
    const {
        state: { },
        handleToggleVectorStoreSelection
    } = useContext(HomeContext);
    const [isSelected, setIsSelected] = useState(false);
    const handleFileClick = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        handleToggleVectorStoreSelection(vs.name)
        setIsSelected(!isSelected)
    };

    return (
        <div
            key={vs.name}
            className={`w-full flex items-center justify-center cursor-pointer px-1 py-1 text-sm text-black dark:text-white flex items-center shadow-sm rounded-md ${isSelected ? 'bg-blue-100 dark:bg-blue-600' : 'bg-gray-50 hover:bg-gray-100 dark:bg-[#303133] dark:hover:bg-neutral-600'}`}
            onClick={handleFileClick}
        >
            <div className="font-medium truncate w-full text-center">{vs.name.toUpperCase()}</div>
        </div>
    );
};
