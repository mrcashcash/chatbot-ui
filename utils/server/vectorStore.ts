import fs from 'fs';
import { OpenAIEmbeddings } from 'langchain/embeddings/openai';
import { Document } from 'langchain/document';
import { HNSWLib } from 'langchain/vectorstores/hnswlib';
import { OPENAI_API_KEY, STORE_PATH } from '../app/const';

const directoryExistsAndNotEmpty = (path: string): boolean => {
    if (!fs.existsSync(path)) {
        fs.mkdirSync(path);
        return false;
    }
    return fs.readdirSync(path).length > 0;
};


export const embedDocs = async (docs: Document[]): Promise<void> => {
    const vs = await VectorStore.getInstance();
    await vs.addDocuments(docs);
    vs.save(STORE_PATH);
    console.log('Docs added to VectorStore and Saved...');
};

export const searchQuery = async (query: string): Promise<Document[]> => {
    const vs = await VectorStore.getInstance();
    const docs: Document[] = await vs.similaritySearch(query, 3);
    return docs;
};


class VectorStore {
    static instance: HNSWLib;

    private constructor() { }

    /**
     * Get the singleton instance of the VectorStore class.
     * @returns {Promise<HNSWLib>} A promise that resolves to the HNSWLib instance.
     */
    static async getInstance(): Promise<HNSWLib> {
        if (!VectorStore.instance) {
            try {
                VectorStore.instance = await VectorStore.init();
            } catch (error) {
                console.error('Failed to initialize VectorStore:', error);
                throw error;
            }
        }

        return VectorStore.instance;
    }

    /**
     * Initialize the VectorStore by creating a new HNSWLib instance or loading an existing one.
     * @returns {Promise<HNSWLib>} A promise that resolves to the HNSWLib instance.
     */
    private static async init(): Promise<HNSWLib> {
        let vectorStore = new HNSWLib(new OpenAIEmbeddings({ openAIApiKey: OPENAI_API_KEY }), { "space": "cosine", "numDimensions": 1536 });

        if (directoryExistsAndNotEmpty(STORE_PATH)) {
            console.log('Loading existing vector store from:', STORE_PATH);
            try {
                vectorStore = await HNSWLib.load(STORE_PATH, new OpenAIEmbeddings());
            } catch (error) {
                console.error('Failed to load existing vector store:', error);
                throw error;
            }
        } else {
            console.log('Creating a new vector store');
        }

        return vectorStore;
    }
}
