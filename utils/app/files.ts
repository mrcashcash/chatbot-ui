import { VectorStoreInfo } from "../server/vectorStore";

export const saveSelectedVectorStores = (vs: string[]) => {
    localStorage.setItem('selectedVectorStores', JSON.stringify(vs));
};

