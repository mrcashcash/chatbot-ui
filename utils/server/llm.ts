import { TextLoader } from 'langchain/document_loaders/fs/text';
import { PDFLoader } from 'langchain/document_loaders/fs/pdf';
import { JSONLinesLoader, JSONLoader } from 'langchain/document_loaders/fs/json';
import { EPubLoader } from 'langchain/document_loaders/fs/epub';
import path from 'path';
import { Document } from "langchain/document";
import { TokenTextSplitter } from "langchain/text_splitter";
import { GithubRepoLoader } from 'langchain/document_loaders/web/github';
import { DocumentLoader } from 'langchain/document_loaders/base';
import { CheerioWebBaseLoader } from 'langchain/document_loaders/web/cheerio';
import { embedDocs } from './vectorStore';
import { MSG_TYPE, UPLOAD_DIR } from '../app/const';
import { SelectorType } from 'cheerio';

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
    const results: Document[] = [];
    const splitter = new TokenTextSplitter({
        encodingName: 'cl100k_base',
        chunkSize: 1000,
        chunkOverlap: 0,

    });
    let vs_name = values[2]
    if (type === MSG_TYPE.URL && values) {
        let link = values[0]
        let selector = values[1]
        selector = selector != '' ? selector : 'body'
        console.log("Link: ", link)
        const loader = new CheerioWebBaseLoader(link, { selector: selector as SelectorType });
        const docs = await loader.loadAndSplit(splitter);
        results.push(...docs)

    } else if (type === MSG_TYPE.GITHUB_REPO && values) {
        let git_link = values[0]
        let branch = values[1]
        // branch = branch != "" ? branch : 'main'
        console.log("Git_Link: ", git_link)
        const loader = new GithubRepoLoader(git_link, { accessToken: process.env.GITHUB_TOKEN, branch: branch, unknown: "warn", recursive: true })
        const docs = await loader.load();
        results.push(...docs)

    } else if (type === MSG_TYPE.FILES && values) {
        const filenames = values
        vs_name = filenames[0].split('.').slice(0, -1).join('.') + '...';
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
    console.log("results=:=: ", results.length)
    embedDocs(results, vs_name)
    // const json = JSON.stringify(results);
    // await fs.writeFile('example_langchainjs.json', json);
    return results;
};

// export const processQuery = async (query: string) => {
//     return searchQuery(query)
// }

