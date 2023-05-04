import { Plugin, PluginID } from '@/types/plugin';
import { VectorStoreInfo } from '../server/vectorStore';

export const getEndpoint = (plugin: Plugin | null) => {
  if (!plugin) {
    return 'api/chat';
  }

  if (plugin.id === PluginID.GOOGLE_SEARCH) {
    return 'api/google';
  }
  if (plugin.id === PluginID.FILES_UPLOAD) {
    return 'api/query_agent'
    // return 'api/query';
  }
  if (plugin.id === PluginID.WEB_SCRAPE) {
    return 'api/webscrape';
  }
  if (plugin.id === PluginID.GITHUB_REPO) {
    return 'api/webscrape';
  }
  return 'api/chat';
};

export const fetchVectorStoreList = async () => {
  try {
    const response = await fetch('/api/getVectorStoresList');
    if (response.ok) {
      const vectorStoreList = await response.json() as VectorStoreInfo[];
      return vectorStoreList;
    } else {
      console.error('Failed to fetch files list.');
      return [];
    }
  } catch (error) {
    console.error('Error fetching files list:', error);
    return [];
  }
};
