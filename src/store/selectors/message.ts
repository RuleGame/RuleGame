import { RootState } from '../reducers';

export const messageSelector = (state: RootState) => state.message.messageList;
