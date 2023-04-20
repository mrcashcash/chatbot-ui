import fs from 'fs';
import path from 'path';
import pdfParse from 'pdf-parse';
import { UPLOAD_DIR } from '../app/const';

const uploadDir = path.join(process.cwd(), UPLOAD_DIR);

const readFile = (filepath: fs.PathOrFileDescriptor) => {
    return new Promise<string>((resolve, reject) => {
        fs.readFile(filepath, 'utf8', (err, data) => {
            if (err) {
                reject(err);
            } else {
                resolve(data);
            }
        });
    });
};

const processTxtFile = async (filepath: string) => {
    try {
        return await readFile(filepath);
    } catch (err) {
        console.error(err);
        return ''; // Return an empty string in case of an error
    }
};

const processPdfFile = async (filepath: string) => {
    try {
        const dataBuffer = fs.readFileSync(filepath);
        const pdfData = await pdfParse(dataBuffer);
        return pdfData.text;
    } catch (error) {
        console.error('Error parsing PDF file:', error);
        return ''; // Return an empty string in case of an error
    }
};

const processingData = async (filenames: string[]) => {
    const results = [];

    for (const filename of filenames) {
        const extension = path.extname(filename).toLowerCase();
        const filepath = path.join(uploadDir, filename);

        console.log('File Path:', filepath);
        console.log('File Name:', filename);
        console.log('------------');

        let txtData: string = '';

        switch (extension) {
            case '.txt':
                txtData = await processTxtFile(filepath);
                break;
            case '.pdf':
                txtData = await processPdfFile(filepath);
                break;
            default:
                console.error('Invalid file type:', extension);
        }

        console.log('txtData:', txtData);
        results.push(txtData);
    }

    return results;
};

export default processingData;
