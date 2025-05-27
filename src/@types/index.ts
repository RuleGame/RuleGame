// eslint-disable-next-line import/no-cycle
import { RootAction } from '../store/actions';
import { BucketPosition } from '../constants/BucketPosition';
import { Color } from '../constants/Color';
import { Shape } from '../constants/Shape';

export type BoardObjectId = string;

export type BoardObjectType = {
  id: string; // -1 denotes an undefined value
  color: Color;
  shape: Shape;
  x: number;
  y: number;
  label?: string;
};

export type BucketType = { pos: BucketPosition; x: number; y: number; id: string };

export type DropAttempt = { dragged: string; dropped: BucketPosition; successful?: boolean };

export type AtomFn = (
  boardObjectId: BoardObjectId,
  totalMoveHistory: DropAttempt[],
  boardObjects: { [id: string]: BoardObjectType },
) => Set<BucketPosition> | BucketPosition;

export type PositionsFn = (
  boardObjectId: BoardObjectId,
  totalMoveHistory: DropAttempt[],
  boardObjects: { [id: string]: BoardObjectType },
  checkedObjects: Set<string>,
) => Set<number> | undefined;

export type Atom = {
  id: string;
  counter: number;
  shape: Shape;
  color: Color;
  // Undefined means any position (*)
  position?: PositionsFn | number;
  fns: AtomFn[];
};

export type ActionButton = {
  key: string;
  label: string;
  action: ((id: string) => RootAction) | RootAction | (RootAction | ((id: string) => RootAction))[];
};

export type RuleRow = Atom[];

export type RuleArray = RuleRow[];

export type Game = {
  id: string;
  name: string;
  ruleArray?: string;
  boardObjectsArrays: string[];
  useRandomBoardObjects: boolean;
  numRandomBoardObjects: number;
  numConsecutiveSuccessfulMovesBeforePromptGuess?: number;
  restartIfNotCleared?: boolean;
  numDisplaysLimit?: number;
  showStackMemoryOrder?: boolean;
  showGridMemoryOrder?: boolean;
  twoPGAdve: boolean;
  twoPGCoop: boolean;
};

export type HistoryLog = {
  playerName: string;
  displays: {
    game: string;
    time: number;
    boardObjectsArray: BoardObjectType[];
    dropAttempts: (DropAttempt & { time: number })[];
  }[];
};

export type LocalStorageWorkerIdKey = {
  seriesNo?: number;
  savedRuleGuess?: string;
};

export type MessageType = {
  who: string;
  text: string;
  timestamp: number;
};

export type SocketMessage = { type: 'READY_DIS' };
