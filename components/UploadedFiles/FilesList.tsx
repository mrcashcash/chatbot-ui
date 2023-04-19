import { FC, MutableRefObject, MouseEventHandler, useState, useContext } from 'react';

import { IconTxt, IconFileUnknown, IconCheck, IconX, IconTrash, IconPdf } from '@tabler/icons-react';
import { FileTypeIcons, UploadFile } from '@/types/uploadfile';
import SidebarActionButton from '../Buttons/SidebarActionButton';
import HomeContext from '@/pages/api/home/home.context';


interface Props {
    file: UploadFile;
    index: number | null;
    // filesListRef: MutableRefObject<HTMLUListElement | null>;
}

export const FilesList: FC<Props> = ({
    file,
    index
    // filesListRef,
}) => {
    const { handleDeleteFile } = useContext(HomeContext);
    const [showModal, setShowModal] = useState<boolean>(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const formatFileSize = (size: number): string => {
        const units = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        let unitIndex = 0;

        while (size >= 1024 && unitIndex < units.length - 1) {
            size /= 1024;
            unitIndex++;
        }

        return `${size.toFixed(2)} ${units[unitIndex]}`;
    };
    const fileTypeIcons: FileTypeIcons = {
        'txt': <IconTxt />,
        'epub': <IconTxt />,
        'pdf': <IconPdf />,
    };
    const getFileExtension = (filename?: string): string => {
        if (!filename) {
            console.error('Undefined or empty filename');
            return '';
        }

        // Check for a valid filename using a regular expression
        const validFilenameRegex = /^[^\\/:\*\?"<>\|]+$/;
        if (!validFilenameRegex.test(filename)) {
            console.error('Invalid filename:', filename);
            return '';
        }

        const parts = filename.split('.');
        return parts.length > 1 ? (parts.pop()?.toLowerCase() || '') : '';
    };

    const renderIcon = (filename: string) => {
        const fileExtension = getFileExtension(filename);
        return fileTypeIcons[fileExtension] || <IconFileUnknown />;
    };
    const handleCancelDelete: MouseEventHandler<HTMLButtonElement> = (e) => {
        e.stopPropagation();
        setIsDeleting(false);
    };
    const handleOpenDeleteModal: MouseEventHandler<HTMLButtonElement> = (e) => {
        e.stopPropagation();
        setIsDeleting(true);
    };
    return (
        <ul
            // ref={filesListRef}
            className="z-10 max-h-max w-full overflow-scroll rounded bg-white dark:border-neutral-500 dark:bg-[#343541] dark:text-white dark:shadow-[0_0_15px_rgba(0,0,0,0.10)]"
        >


            <li
                key={file.id}
                className='bg-gray-200 dark:bg-[#202123] cursor-pointer ml-2 px-2 py-1 text-sm text-black dark:text-white flex items-center'
                onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    // onSelect(key);
                }}
            >
                <div className="flex items-center">
                    {renderIcon(file.name)}
                    <span className="ml-3">{file.name}</span>
                </div>
                {/* <span className="ml-auto text-xs text-gray-500 dark:text-gray-400">
                    {formatFileSize(file.size)}
                </span> */}
                {(isDeleting) && (
                    <div className="absolute right-7 z-10 flex text-gray-300">
                        <SidebarActionButton handleClick={(e) => {
                            e.stopPropagation();
                            if (isDeleting) {
                                handleDeleteFile(file.id);
                            }
                            setIsDeleting(false);
                        }}>
                            <IconCheck size={18} />
                        </SidebarActionButton>
                        <SidebarActionButton handleClick={handleCancelDelete}>
                            <IconX size={18} />
                        </SidebarActionButton>
                    </div>
                )}

                {!isDeleting && (
                    <div className="absolute right-7 z-10 flex text-gray-300">
                        <SidebarActionButton handleClick={handleOpenDeleteModal}>
                            <IconTrash size={18} />
                        </SidebarActionButton>
                    </div>
                )}

            </li>

        </ul>


    );
};
