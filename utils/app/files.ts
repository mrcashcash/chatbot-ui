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

    localStorage.setItem('files', JSON.stringify(files));

};


