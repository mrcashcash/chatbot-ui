import { NextApiRequest, NextApiResponse } from 'next';
import formidable, { File } from 'formidable';
import fs from 'fs';
import path from 'path';

import { processingData } from '@/utils/server/llm';
import { UPLOAD_DIR } from '@/utils/app/const';


export const config = {
    api: {
        bodyParser: false,
    },
};

const handler = async (req: NextApiRequest, res: NextApiResponse<any>) => {
    try {
        const form = new formidable.IncomingForm({ uploadDir: UPLOAD_DIR, keepExtensions: true, multiples: true });
        const uploadDir = path.join(process.cwd(), UPLOAD_DIR);
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
            const resp = processingData(files_array);
            const fileNames = fs.readdirSync(uploadDir);
            const filesOnly = fileNames.filter((name) => {
                const filePath = path.join(uploadDir, name);
                return fs.statSync(filePath).isFile();
            });
            res.status(200).json({ updatedfiles: files_array, allfiles: filesOnly });
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error' });
    }
};

export default handler;
