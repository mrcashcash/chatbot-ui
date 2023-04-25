import { Dispatch, createContext } from 'react';

import { ActionType } from '@/hooks/useCreateReducer';

import { Conversation } from '@/types/chat';
import { KeyValuePair } from '@/types/data';
import { FolderType } from '@/types/folder';

import { HomeInitialState } from './home.state';
import { UploadFile } from '@/types/uploadfile';
import { VectorStoreInfo } from '@/utils/server/vectorStore';

export interface HomeContextProps {
  state: HomeInitialState;
  dispatch: Dispatch<ActionType<HomeInitialState>>;
  handleNewConversation: () => void;
  handleCreateFolder: (name: string, type: FolderType) => void;
  handleDeleteFolder: (folderId: string) => void;
  handleUpdateFolder: (folderId: string, name: string) => void;
  handleSelectConversation: (conversation: Conversation) => void;
  handleUpdateConversation: (
    conversation: Conversation,
    data: KeyValuePair,
  ) => void;
  // handleUpdateVectorStoreList: (VectorStoreList: VectorStoreInfo[]) => void;
  refreshVectorStoresList: () => void;
  handleToggleVectorStoreSelection: (name: string) => void;

}

const HomeContext = createContext<HomeContextProps>(undefined!);

export default HomeContext;
