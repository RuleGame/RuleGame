import { RootState } from '../reducers';

export const createNumConsecutiveSuccessfulMovesBeforePromptGuessSelector = (gameId: string) => (
  state: RootState,
) => state.games.byId[gameId].numConsecutiveSuccessfulMovesBeforePromptGuess;
