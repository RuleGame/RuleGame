import { getType } from 'typesafe-actions';
import { RootAction } from '../actions';
import { addMessage, removeAllMessages } from '../actions/message';
import { MessageType } from '../../../src/@types';

export type State = {
  messageList: MessageType[];
};

export const initialState: State = {
  messageList: [],
};

const reducer = (state: State = initialState, action: RootAction): State => {
  switch (action.type) {
    case getType(addMessage):
      return {
        messageList: [
          ...state.messageList,
          {
            who: action.payload.who,
            text: action.payload.text,
            timestamp: action.payload.timestamp,
          },
        ],
      };

    case getType(removeAllMessages):
      return {
        ...state,
        messageList: [],
      };

    default:
      return state;
  }
};

export default reducer;
