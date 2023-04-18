export interface UploadFile {
    id: string;
    name: string;
    size: number;
    type: string;
}
export interface FileTypeIcons {
    [key: string]: JSX.Element;
}