import path from "path";

export const DEFAULT_SYSTEM_PROMPT =
  process.env.NEXT_PUBLIC_DEFAULT_SYSTEM_PROMPT ||
  "You are ChatGPT, a large language model trained by OpenAI. Follow the user's instructions carefully. Respond using markdown.";

export const OPENAI_API_HOST =
  process.env.OPENAI_API_HOST || 'https://api.openai.com';

export const DEFAULT_TEMPERATURE =
  parseFloat(process.env.NEXT_PUBLIC_DEFAULT_TEMPERATURE || "1");

export const OPENAI_API_TYPE =
  process.env.OPENAI_API_TYPE || 'openai';

export const OPENAI_API_VERSION =
  process.env.OPENAI_API_VERSION || '2023-03-15-preview';

export const OPENAI_ORGANIZATION =
  process.env.OPENAI_ORGANIZATION || '';

export const AZURE_DEPLOYMENT_ID =
  process.env.AZURE_DEPLOYMENT_ID || '';
//Files

export const UPLOAD_DIR = 'uploadedFiles'
// Store 
export const STORE_ROOT_PATH = 'vectorstores';
// export const STORE_PATH = UPLOAD_DIR + '/store';
export const OPENAI_API_KEY = process.env.OPENAI_API_KEY || ''
export enum MSG_TYPE {
  FILES = 0,
  URL = 1,
  GITHUB_REPO = 2,
  GOOGLE_SEARCH = 3,
}