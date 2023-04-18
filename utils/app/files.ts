import { UploadFile } from '@/types/uploadfile';

export const newFile = (newFile: UploadFile, allFiles: UploadFile[]) => {
    const newFiles = allFiles.map((c) => {
        if (c.id === newFile.id) {
            return newFile;
        }

        return c;
    });

    saveFiles(newFiles);

    return {
        single: newFile,
        all: newFiles,
    };
};

export const saveFiles = (files: UploadFile[]) => {
    const existingFiles = localStorage.getItem('files');

    if (existingFiles && existingFiles !== '[]') {
        const parsedFiles: UploadFile[] = JSON.parse(existingFiles);
        const updatedFiles: UploadFile[] = parsedFiles.concat(files);
        localStorage.setItem('files', JSON.stringify(updatedFiles));
    } else {
        localStorage.setItem('files', JSON.stringify(files));
    }
};


