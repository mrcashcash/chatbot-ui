import { ChangeEvent, useContext, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';

import HomeContext from '@/pages/api/home/home.context';
import { FilesList } from './FilesList';
import { UploadFile } from '@/types/uploadfile';
import { IconFileUpload, IconUpload } from '@tabler/icons-react';

const fetchFilesList = async () => {
    try {
        const response = await fetch('/api/getFilesList');
        if (response.ok) {
            const filesList = await response.json();
            return filesList;
        } else {
            console.error('Failed to fetch files list.');
            return [];
        }
    } catch (error) {
        console.error('Error fetching files list:', error);
        return [];
    }
};

const UploadedFile = () => {
    const { t } = useTranslation('uploadedfiles');
    const filesListRef = useRef<HTMLUListElement | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);


    const {
        state: { uploadedFiles },
        dispatch: homeDispatch,
        handleUpdateUploadedFiles
    } = useContext(HomeContext);

    const handleFileUploadChange = async (event: ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;

        if (files) {

            const formData = new FormData();
            const newFiles: UploadFile[] = Array.from(files).reduce((acc: UploadFile[], file: File) => {
                formData.append('files', file);

                const newFile: UploadFile = {
                    id: file.name, // Use a unique identifier for each file
                    name: file.name,
                    size: file.size,
                    type: file.type,
                    // Add other necessary properties
                };

                acc.push(newFile);
                return acc;
            }, []);
            try {
                const response = await fetch('/api/uploadFiles', {
                    method: 'POST',
                    body: formData,
                });

                if (response.ok) {
                    console.log('Files uploaded successfully.');
                    handleUpdateUploadedFiles(newFiles);
                } else {
                    console.error('Failed to upload files.');
                }
            } catch (error) {
                console.error('Error uploading files:', error);
            }
        }
    };
    useEffect(() => {
        const loadFilesList = async () => {
            const filesList = await fetchFilesList();
            handleUpdateUploadedFiles(filesList);
        };

        loadFilesList();
    }, []);
    return (
        <div className="flex w-full flex-col gap-1">
            <ul className="z-10 max-h-max w-full overflow-scroll rounded bg-white shadow-[0_0_10px_rgba(0,0,0,0.10)] dark:border-neutral-500 dark:bg-[#343541] dark:text-white dark:shadow-[0_0_15px_rgba(0,0,0,0.10)]">
                <div className="flex justify-between items-center px-3 py-1">
                    <li className="text-lg font-semibold text-black dark:text-white">
                        Files
                    </li>
                    <button
                        type="button"
                        className="p-2 rounded hover:bg-gray-200 dark:hover:bg-neutral-700"
                        onClick={() => fileInputRef.current && fileInputRef.current.click()}
                    >
                        <IconFileUpload size={24} />
                    </button>
                </div>
                {uploadedFiles && uploadedFiles.length > 0 &&
                    uploadedFiles.map((file, index) => (
                        <FilesList key={index} file={file} index={index} />
                    ))}
            </ul>
            <input
                type="file"
                multiple
                style={{ display: 'none' }}
                ref={fileInputRef}
                onChange={handleFileUploadChange}
            />
        </div>

    );
};

export default UploadedFile;
