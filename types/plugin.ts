import { KeyValuePair } from './data';

export interface Plugin {
  id: PluginID;
  name: PluginName;
  requiredKeys: KeyValuePair[];
}

export interface PluginKey {
  pluginId: PluginID;
  requiredKeys: KeyValuePair[];
}

export enum PluginID {
  GOOGLE_SEARCH = 'google-search',
  FILES_UPLOAD = 'files-upload',
  WEB_SCRAPE = 'web-scrape',
  GITHUB_REPO = 'github-repo' // new enum value for GithubRepo plugin
}

export enum PluginName {
  GOOGLE_SEARCH = 'Google Search',
  FILES_UPLOAD = 'Talk to Db',
  WEB_SCRAPE = 'Web Scrape',
  GITHUB_REPO = 'Github Repo' // new enum value for GithubRepo plugin
}

export const pluginKeysMap = {
  [PluginID.GOOGLE_SEARCH]: ['googleAPIKey', 'googleCSEId'],
  [PluginID.FILES_UPLOAD]: ['filesSrverAPIKey', 'fileServerCSEId'],
  [PluginID.WEB_SCRAPE]: ['webAPIKey', 'webCSEId'],
  [PluginID.GITHUB_REPO]: ['githubAPIKey', 'githubRepoId'] // new entry for GithubRepo plugin
};

export const Plugins: Record<PluginID, Plugin> = {
  [PluginID.GOOGLE_SEARCH]: {
    id: PluginID.GOOGLE_SEARCH,
    name: PluginName.GOOGLE_SEARCH,
    requiredKeys: [
      {
        key: 'GOOGLE_API_KEY',
        value: '',
      },
      {
        key: 'GOOGLE_CSE_ID',
        value: '',
      },
    ],
  },
  [PluginID.FILES_UPLOAD]: {
    id: PluginID.FILES_UPLOAD,
    name: PluginName.FILES_UPLOAD,
    requiredKeys: [
      {
        key: 'FILES_API_KEY',
        value: '',
      },
      {
        key: 'FILES_CSE_ID',
        value: '',
      },
    ],
  },
  [PluginID.WEB_SCRAPE]: {
    id: PluginID.WEB_SCRAPE,
    name: PluginName.WEB_SCRAPE,
    requiredKeys: [
      {
        key: 'WEB_SCRAPE_API_KEY',
        value: '',
      },
      {
        key: 'WEB_SCRAPE_CSE_ID',
        value: '',
      },
    ],
  },
  [PluginID.GITHUB_REPO]: {
    id: PluginID.GITHUB_REPO,
    name: PluginName.GITHUB_REPO,
    requiredKeys: [
      {
        key: 'GITHUB_API_KEY',
        value: '',
      },
      {
        key: 'GITHUB_REPO_ID',
        value: '',
      },
    ],
  }
};

export const PluginList = Object.values(Plugins);
