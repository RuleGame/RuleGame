import { getType } from 'typesafe-actions';
import { RootAction } from '../actions';
import { Message, addMessage } from '../actions/message';

export type State = {
  messageList: Message[];
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
            id: action.payload.id,
            text: action.payload.text,
            timestamp: action.payload.timestamp,
          },
        ],
      };

    default:
      return state;
  }
};

export default reducer;
