import { OpenAI } from 'langchain/llms/openai';
import { OpenAIEmbeddings } from 'langchain/embeddings/openai';
import { TextLoader } from 'langchain/document_loaders/fs/text';
import { PDFLoader } from 'langchain/document_loaders/fs/pdf';
import { JSONLinesLoader, JSONLoader } from 'langchain/document_loaders/fs/json';
import { EPubLoader } from 'langchain/document_loaders/fs/epub';
import path from 'path';
import { Document } from "langchain/document";
import { TokenTextSplitter } from "langchain/text_splitter";
import { DocumentLoader } from 'langchain/document_loaders';
import { embedDocs, searchQuery } from './vectorStore';

import fs from 'fs';
import { error } from 'console';

const embeddings = new OpenAIEmbeddings();
const model = new OpenAI({ openAIApiKey: process.env.OPENAI_API_KEY, temperature: 0.9 });
const uploadDir = path.join(process.cwd(), 'uploadedFiles');
type FileLoaders = {
    [extension: string]: () => DocumentLoader;
};

const getFileLoader = (filepath: string, extension: string, splitter: TokenTextSplitter): Promise<Document[]> | null => {
    console.log("Enter getFileLoader...")
    const fileLoaders: FileLoaders = {
        '.txt': () => new TextLoader(filepath),
        '.json': () => new JSONLoader(filepath),
        '.jsonl': () => new JSONLinesLoader(filepath, '/html'),
        '.epub': () => new EPubLoader(filepath),
        '.pdf': () => new PDFLoader(filepath),
    };

    const loader = fileLoaders[extension];
    console.log("before loader in getFileLoader...")
    return loader ? loader().loadAndSplit(splitter) : null;
};

export const processingData = async (filenames: string[]): Promise<Document[]> => {
    const results: Document[] = [];
    const splitter = new TokenTextSplitter({
        encodingName: 'gpt2',
        chunkSize: 4000,
        chunkOverlap: 200,
    });

    for (const filename of filenames) {
        const extension = path.extname(filename).toLowerCase();
        const filepath = path.join(uploadDir, filename);
        console.log('File Name:', filename);
        console.log('------------');

        const docs = await getFileLoader(filepath, extension, splitter);
        console.log('docs:', docs);
        if (docs) {
            results.push(...docs);
            console.log('Updating Docs.... Sending to Embadd...')
        } else {
            console.error('Invalid file type:', extension);
        }
    }
    embedDocs(results)
    return results;
};

export const processQuery = async (query: string) => {
    return searchQuery(query)
}

