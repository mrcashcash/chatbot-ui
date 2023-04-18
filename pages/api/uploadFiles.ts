import { NextApiRequest, NextApiResponse } from 'next';
import formidable, { File } from 'formidable';
import fs from 'fs';
import path from 'path';

import { processingData } from '@/utils/server/llm';


export const config = {
    api: {
        bodyParser: false,
    },
};

const handler = async (req: NextApiRequest, res: NextApiResponse<any>) => {
    try {
        const form = new formidable.IncomingForm({ uploadDir: 'uploadedFiles', keepExtensions: true, multiples: true });
        const uploadDir = path.join(process.cwd(), 'uploadedFiles');
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir);
        }
        form.parse(req, (err, fields, files) => {
            if (err) {
                console.error(err);
                res.status(500).json({ error: 'Error parsing the form' });
                return;
            }

            // Save uploaded files
            const files_array: string[] = []
            Object.values(files).forEach((fileOrFiles) => {
                const files = Array.isArray(fileOrFiles) ? fileOrFiles : Array(fileOrFiles)
                files.forEach((file: File) => {
                    console.log('file: ', file.originalFilename)
                    // Check if the file already exists

                    const oldPath = file.filepath;
                    const filename = file.originalFilename ? file.originalFilename : file.newFilename
                    const newPath = path.join(uploadDir, filename);
                    // Check if the file already exists with the original name
                    if (fs.existsSync(newPath)) {
                        console.log('File already exists, skipping:', newPath);
                        return;
                    }
                    files_array.push(filename)
                    fs.renameSync(oldPath, newPath);
                });
            });
            const resp = processingData(files_array)
            res.status(200).json({ fields, files });
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error' });
    }
};

export default handler;
