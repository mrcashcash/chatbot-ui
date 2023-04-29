// import fs from 'fs';
// import { OpenAIEmbeddings } from 'langchain/embeddings/openai';
// import { Document } from "langchain/document";
// import { HNSWLib } from 'langchain/vectorstores/hnswlib';
// import { OPENAI_API_KEY, STORE_PATH } from '../app/const';

// const directoryExistsAndNotEmpty = (path: string): boolean => {
//     if (!fs.existsSync(path)) {
//         fs.mkdirSync(path);
//         return false;
//     }
//     return fs.readdirSync(path).length > 0;
// };


// export const embedDocs = async (docs: Document[]): Promise<void> => {
//     const vs = await VectorStore.getInstance();
//     await vs.addDocuments(docs);
//     vs.save(STORE_PATH);
//     console.log('Docs added to VectorStore and Saved...');
// };

// export const processQuery = async (query: string): Promise<Document[]> => {
//     const vs = await VectorStore.getInstance();
//     const docs: Document[] = await vs.similaritySearch(query, 3);
//     return docs;
// };


// export class VectorStore {
//     static instance: HNSWLib;

//     private constructor() { }

//     /**
//      * Get the singleton instance of the VectorStore class.
//      * @returns {Promise<HNSWLib>} A promise that resolves to the HNSWLib instance.
//      */
//     static async getInstance(): Promise<HNSWLib> {
//         if (!VectorStore.instance) {
//             try {
//                 VectorStore.instance = await VectorStore.init();
//             } catch (error) {
//                 console.error('Failed to initialize VectorStore:', error);
//                 throw error;
//             }
//         }

//         return VectorStore.instance;
//     }

//     /**
//      * Initialize the VectorStore by creating a new HNSWLib instance or loading an existing one.
//      * @returns {Promise<HNSWLib>} A promise that resolves to the HNSWLib instance.
//      */
//     private static async init(): Promise<HNSWLib> {
//         let vectorStore = new HNSWLib(new OpenAIEmbeddings({ openAIApiKey: OPENAI_API_KEY }), { "space": "cosine", "numDimensions": 1536 });

//         if (directoryExistsAndNotEmpty(STORE_PATH)) {
//             console.log('Loading existing vector store from:', STORE_PATH);
//             try {
//                 vectorStore = await HNSWLib.load(STORE_PATH, new OpenAIEmbeddings());
//             } catch (error) {
//                 console.error('Failed to load existing vector store:', error);
//                 throw error;
//             }
//         } else {
//             console.log('Creating a new vector store');
//         }

//         return vectorStore;
//     }
// }
import fs from 'fs';
import path from 'path';
import { OpenAIEmbeddings } from 'langchain/embeddings/openai';
import { Document } from "langchain/document";
import { HNSWLib } from 'langchain/vectorstores/hnswlib';
import { OPENAI_API_KEY, STORE_ROOT_PATH } from '../app/const';
import { error } from 'console';

export interface VectorStoreInfo {
    vectorStore: HNSWLib;
    name: string;
    description: string;
}


const directoryExistsAndNotEmpty = (path: string): boolean => {
    if (!fs.existsSync(path)) {
        fs.mkdirSync(path);
        return false;
    }
    return fs.readdirSync(path).length > 0;
};

export const embedDocs = async (docs: Document[], storeName: string): Promise<void> => {
    const vs = await VectorStore.getInstance(storeName);

    await vs.addDocuments(docs);
    vs.save(getStorePath(storeName));
    console.log('Docs added to VectorStore and Saved...');
};

export const processQuery = async (query: string, storeName: string): Promise<Document[]> => {
    const vs = await VectorStore.getInstance(storeName);
    const docs: Document[] = await vs.similaritySearch(query, 3);
    return docs;
};

const getStorePath = (storeName: string): string => {
    return path.join(STORE_ROOT_PATH, storeName);
};

export class VectorStore {
    private static instances: VectorStoreInfo[] = [];

    private constructor(private readonly vectorStore: HNSWLib, private readonly name: string, private readonly description: string, private readonly directoryPath: string) { }

    /**
     * Get the singleton instance of the VectorStore class for the given store name.
     * @returns {Promise<VectorStore>} A promise that resolves to the VectorStore instance.
     */
    static async getInstance(storeName: string): Promise<HNSWLib> {
        const storePath = getStorePath(storeName);
        if (!fs.existsSync(storePath)) {
            fs.mkdirSync(storePath);
        }
        const instance = VectorStore.instances.find(i => i.name === storeName)?.vectorStore;
        if (instance) {
            return instance;
        }
        const vs_info = await VectorStore.getVectorStoreInfo(storeName) as VectorStoreInfo //VectorStore.init(storeName);
        return vs_info.vectorStore
    }

    /**
     * Initialize the VectorStore by creating a new HNSWLib instance or loading an existing one.
     * @returns {Promise<HNSWLib>} A promise that resolves to the HNSWLib instance.
     */
    private static async init(subDir: string): Promise<VectorStoreInfo> {

        const storePath = path.join(STORE_ROOT_PATH, subDir);
        let vs = new HNSWLib(
            new OpenAIEmbeddings({ openAIApiKey: OPENAI_API_KEY }),
            { space: 'cosine', numDimensions: 1536 }
        );

        if (directoryExistsAndNotEmpty(storePath)) {
            try {
                vs = await HNSWLib.load(storePath, new OpenAIEmbeddings());
            } catch (error) {
                console.error(`Failed to load vector store from ${storePath}: ${error}`);
            }
        } else {
            console.log("Starting New VectorStore Named:", subDir)
        }

        return {
            vectorStore: vs,
            name: subDir,
            description: `Vector Store for ${subDir}`,
        };
    }

    public static async getVectorStoreInfo(storeName?: string): Promise<VectorStoreInfo[] | VectorStoreInfo> {
        const subDirectories = fs.readdirSync(STORE_ROOT_PATH, { withFileTypes: true })
            .filter((dirent) => dirent.isDirectory())
            .map((dirent) => dirent.name);

        const vectorStores: VectorStoreInfo[] = [];
        for (const subDir of subDirectories) {
            const vsInfo = await VectorStore.init(subDir);
            vectorStores.push(vsInfo);
        }
        if (!storeName) return vectorStores;
        const vs_store = vectorStores.find(x => x.name === storeName)
        if (vs_store) return vs_store
        else {
            console.error("Unable To Find Vector Store nameed:", storeName)
            throw error;
        }

    }

}
