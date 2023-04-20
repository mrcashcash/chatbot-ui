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
import { CheerioWebBaseLoader } from 'langchain/document_loaders/web/cheerio';
import { embedDocs, searchQuery } from './vectorStore';
import { MSG_TYPE, UPLOAD_DIR } from '../app/const';


const embeddings = new OpenAIEmbeddings();
const model = new OpenAI({ openAIApiKey: process.env.OPENAI_API_KEY, temperature: 0.9 });
const uploadDir = path.join(process.cwd(), UPLOAD_DIR);
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

export const processingData = async (type: MSG_TYPE, values: string[]): Promise<Document[]> => {
    // console.log('values:', values);
    const results: Document[] = [];
    const splitter = new TokenTextSplitter({
        encodingName: 'gpt2',
        chunkSize: 1000,
        chunkOverlap: 50,
    });
    if (type === MSG_TYPE.URL && values) {
        const link = values[0];
        console.log("Link: ", link)
        const loader = new CheerioWebBaseLoader(link, { selector: 'body > div.layout__content-wrapper.layout-with-rail__content-wrapper' });
        // const gg: CheerioAPI = await loader.scrape()
        // const data_str = gg.html()
        // console.log('data_str:', data_str);
        const docs = await loader.loadAndSplit(splitter);
        console.log('Web-Doc:', docs)
        results.push(...docs)
    } else if (type === MSG_TYPE.FILES && values) {
        const filenames = values
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
    } else {
        console.error('Invalid message type or missing filenames/Link... ');
    }
    embedDocs(results)
    return results;
};

export const processQuery = async (query: string) => {
    return searchQuery(query)
}

