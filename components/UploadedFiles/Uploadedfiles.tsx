import { ChangeEvent, useContext, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import HomeContext from '@/pages/api/home/home.context';
import { FilesList } from './FilesList';
import { UploadFile } from '@/types/uploadfile';
import { IconFileUpload, IconUpload, IconFolderPlus, IconBrandGithub, IconBrandGoogle, IconExternalLink } from '@tabler/icons-react';
import Spinner from '../Spinner';
import { VectorStoreInfo } from '@/utils/server/vectorStore';
import { toast } from 'react-hot-toast';
import CustomInputModal from './CustomInputModal'; // Import the new modal component
import { MSG_TYPE } from '@/utils/app/const';


const UploadedFile = () => {
    const { t } = useTranslation('uploadedfiles');
    const folderInputRef = useRef<HTMLInputElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [inputType, setInputType] = useState(MSG_TYPE.FILES);
    const [inputLabel1, setInputLabel1] = useState('');
    const [inputLabel2, setInputLabel2] = useState('');
    const {
        state: { VectorStoresList },
        dispatch: homeDispatch, refreshVectorStoresList
    } = useContext(HomeContext);
    const openModalWithLabels = (inputType: MSG_TYPE, label1: string, label2: string) => {
        setInputType(inputType)
        setInputLabel1(label1);
        setInputLabel2(label2);
        setShowModal(true);
    };
    const handleFileUploadChange = async (event: ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        setLoading(true);
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
                    toast.success("Upload Done!", { duration: 500 })
                    refreshVectorStoresList()
                } else {
                    console.error('Failed to upload files.');
                }
                setLoading(false)
            } catch (error) {
                setLoading(false)
                console.error('Error uploading files:', error);
            }
        }
    };
    const handleModalSubmit = async (inputType: MSG_TYPE, inputValue1: string, inputValue2: string, inputValue3: string) => {
        setLoading(true)
        const urlRegex = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
        const stringNoSymbolsOrSpaces = /^[a-zA-Z0-9]+$/;

        if (!inputValue1 || !urlRegex.test(inputValue1)) {
            alert('Input 1 is required and must be a valid website link.');
            return;
        }

        if (inputValue2 && typeof inputValue2 !== 'string') {
            alert('Input 2 must be a string.');
            return;
        }

        if (!inputValue3 || !stringNoSymbolsOrSpaces.test(inputValue3)) {
            alert('Input 3 is required and must contain only characters and numbers (no symbols or spaces).');
            return;
        }

        // Handle the submitted form values here
        console.log('Input Value 1:', inputValue1);
        console.log('Input Value 2:', inputValue2);
        console.log('Input Value 3:', inputValue3);
        try {
            const body = {
                inputType,
                inputValue1,
                inputValue2,
                inputValue3
            }

            const response = await fetch('/api/webscrape', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(body),
            });

            if (response.ok) {
                toast.success("Upload Done!", { duration: 500 })
                refreshVectorStoresList()
            } else {
                console.error('Failed to upload files.');
            }
            setLoading(false)
        } catch (error) {
            setLoading(false)
            console.error('Error uploading files:', error);
        }


    };

    return (
        <div className="flex flex-col items-center space-y-1 border-t border-white/20 pt-1 text-sm">

            <div className="flex items-center">
                <div className='mr-2 font-semibold'>Upload:</div>
                <button
                    type="button"
                    className="p-2 rounded hover:bg-gray-200 dark:hover:bg-neutral-700"
                    onClick={() => fileInputRef.current && fileInputRef.current.click()}
                >
                    <IconFileUpload size={18} />
                </button>
                <button
                    type="button"
                    className="p-2 rounded hover:bg-gray-200 dark:hover:bg-neutral-700"
                    onClick={() => folderInputRef.current && folderInputRef.current.click()}
                >
                    <IconFolderPlus size={18} />
                </button>
                <button
                    type="button"
                    className="p-2 rounded hover:bg-gray-200 dark:hover:bg-neutral-700"
                    onClick={() => openModalWithLabels(MSG_TYPE.GITHUB_REPO, 'Github Repo Link', 'Github Branch')}
                >
                    <IconBrandGithub size={18} />
                </button>
                <button
                    type="button"
                    className="p-2 rounded hover:bg-gray-200 dark:hover:bg-neutral-700"
                    onClick={() => openModalWithLabels(MSG_TYPE.GOOGLE_SEARCH, 'Google Search', 'Google Input 2')}
                >
                    <IconBrandGoogle size={18} />
                </button>
                <button
                    type="button"
                    className="p-2 rounded hover:bg-gray-200 dark:hover:bg-neutral-700"
                    onClick={() => openModalWithLabels(MSG_TYPE.URL, 'WebSite Link', 'Selector // example:"body"')}
                >
                    <IconExternalLink size={18} />
                </button>
            </div>
            <div className="text-lg font-semibold mb-2">Db Indexes</div>
            {loading ? (
                <Spinner />
            ) : (
                VectorStoresList && VectorStoresList.length > 0 ? (
                    <div className="w-full grid grid-cols-2 gap-1 auto-cols-fr">
                        {VectorStoresList.map((vs, index) => (
                            <FilesList key={index} name={vs.name} index={index} />
                        ))}
                    </div>
                ) : (
                    <div>No files.</div>
                )
            )}
            {showModal && (
                <CustomInputModal
                    inputType={inputType}
                    showModal={showModal}
                    closeModal={() => setShowModal(false)}
                    inputLabel1={inputLabel1}
                    inputLabel2={inputLabel2}
                    handleFormValues={handleModalSubmit} // Make sure this line is present
                />
            )}
            <input
                type="file"
                multiple
                style={{ display: 'none' }}
                ref={fileInputRef}
                onChange={handleFileUploadChange}
            />
            <input
                type="file"
                multiple
                style={{ display: 'none' }}
                ref={folderInputRef}
                onChange={handleFileUploadChange}
                {...({ webkitdirectory: '' } as any)}
            />
        </div>

    );
};

export default UploadedFile;
