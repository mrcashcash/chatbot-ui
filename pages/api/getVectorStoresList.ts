// pages/api/getFilesList.ts
import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';
import { UPLOAD_DIR } from '@/utils/app/const';
import { VectorStore } from '@/utils/server/vectorStore';

const uploadsDir = path.join(process.cwd(), UPLOAD_DIR);

const handler = async (req: NextApiRequest, res: NextApiResponse<any>) => {
    try {
        if (req.method !== 'GET') {
            res.setHeader('Allow', 'GET');
            res.status(405).json({ error: 'Method Not Allowed' });
            return;
        }

        // if (!fs.existsSync(uploadsDir)) {
        //     fs.mkdirSync(uploadsDir, { recursive: true });
        // }
        const vs = await VectorStore.getVectorStoreInfo()
        // const fileNames = fs.readdirSync(uploadsDir);
        // const filesOnly = fileNames.filter((name) => {
        //     const filePath = path.join(uploadsDir, name);
        //     return fs.statSync(filePath).isFile();
        // });

        // const uploadFilesList = filesOnly.map((fileName) => {
        //     const filePath = path.join(uploadsDir, fileName);
        //     const fileStats = fs.statSync(filePath);

        //     return {
        //         id: fileName,
        //         name: fileName,
        //         size: fileStats.size,
        //         type: '', // You can use a library like 'mime-types' to detect the file type based on the file extension.
        //     };
        // });

        res.status(200).json(vs);
    } catch (error) {
        console.error('Error fetching files list:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

export default handler;