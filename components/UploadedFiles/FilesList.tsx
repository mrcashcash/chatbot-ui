import { FC, MutableRefObject, MouseEventHandler, useState, useContext } from 'react';

import { IconTxt, IconFileUnknown, IconCheck, IconX, IconTrash, IconPdf, IconExternalLink, IconBrandGithubFilled, IconBrandGithub } from '@tabler/icons-react';
import { FileTypeIcons, UploadFile } from '@/types/uploadfile';
import SidebarActionButton from '../Buttons/SidebarActionButton';
import HomeContext from '@/pages/api/home/home.context';
import { VectorStoreInfo } from '@/utils/server/vectorStore';


interface Props {
    vs: VectorStoreInfo;
    index: number | null;
    // filesListRef: MutableRefObject<HTMLUListElement | null>;
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
    // const fileTypeIcons: FileTypeIcons = {
    //     'txt': <IconTxt size={13} />,
    //     'epub': <IconTxt size={13} />,
    //     'pdf': <IconPdf size={13} />,
    //     'lnk': <IconExternalLink size={13} />,
    //     'git': <IconBrandGithub size={13} />
    // };
    // const getFileDetails = (filename?: string): [string, string] => {
    //     if (!filename) {
    //         console.error('Undefined or empty filename');
    //         return ['', ''];
    //     }

    //     // Check for a valid filename using a regular expression
    //     const validFilenameRegex = /^[^\\/:\*\?"<>\|]+$/;
    //     if (!validFilenameRegex.test(filename)) {
    //         console.error('Invalid filename:', filename);
    //         return ['', ''];
    //     }

    //     let nameWithoutPath = filename.split(/[/\\]/).pop() || '';

    //     const parts = nameWithoutPath.split('.');
    //     const ext = parts.length > 1 ? (parts.pop()?.toLowerCase() || '') : '';

    //     if (parts[0] === 'github' && parts[1] === 'com') {
    //         const [_, __, ___, ...rest] = parts;
    //         nameWithoutPath = rest.join('.');
    //     } else {
    //         nameWithoutPath = parts.join('.');
    //     }

    //     return [nameWithoutPath, ext];
    // };


    return (


        <div
            key={vs.name}
            className={`cursor-pointer ml-0 px-1 py-1 text-sm text-black dark:text-white flex items-center shadow-sm rounded-md ${isSelected ? 'bg-blue-200 dark:bg-blue-700' : 'bg-gray-100 hover:bg-gray-200 dark:bg-[#202123] dark:hover:bg-neutral-700'}`}
            onClick={handleFileClick}
        >
            <div className="flex items-center">
                <div className="ml-1 flex-shrink min-w-0 overflow-hidden">
                    <div className="font-medium truncate w-30">- {vs.name}</div>
                </div>
            </div>
        </div>

    );
};
