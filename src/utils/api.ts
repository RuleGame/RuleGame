import axios, { AxiosResponse } from 'axios';
// eslint-disable-next-line import/no-cycle
import { API_HOST_ORIGIN, IMAGE_BASE_URL } from '../constants';
import { BucketPosition } from '../constants/BucketPosition';
import { Color } from '../constants/Color';
import { Shape } from '../constants/Shape';

export enum FinishCode {
  FINISH = 1,
  GIVEN_UP = 3,
  LOST = 4,
  NO = 0,
  STALEMATE = 2,
}

export enum Code {
  // move accepted and processed
  ACCEPT = 0,
  // Move rejected, and no other move is possible
  // (stalemate). This means that the rule set is bad, and we
  // owe an apology to the player
  STALEMATE = 2,
  // move rejected, because there is no piece in the cell
  EMPTY_CELL = 3,
  // move rejected, because this destination is not allowed
  DENY = 4,
  // Exit requested
  EXIT = 5,
  // New game requested
  NEW_GAME = 6,

  INVALID_COMMAND = -1,
  INVALID_ARGUMENTS = -2,
  INVALID_POS = -3,
  // No game is on now. Start a game first!
  NO_GAME = -4,
  // Used in socket server GAME  command
  INVALID_RULES = -5,
  // Used in web app, when trying to access a non-existent episode
  NO_SUCH_EPISODE = -6,
  // The number of preceding attempts does not match. This may indicate
  // that some HTTP requests have been lost, or a duplicate request
  ATTEMPT_CNT_MISMATCH = -7,
  // This code is returned on successful DISPLAY calls, to
  // indicate that it was a display (no actual move requested)
  // and not a MOVE
  JUST_A_DISPLAY = -8,
}

export type TransitionMap = {
  MAIN?: 'DEFAULT';
  BONUS?: 'DEFAULT' | 'ACTIVATE';
  NEXT?: 'DEFAULT' | 'GIVE_UP';
  END?: 'DEFAULT' | 'GIVE_UP';
};

export enum FeedbackSwitches {
  FIXED = 'fixed',
  FREE = 'free',
  NEW_DISPLAY_TRIGGER = 'new_display_trigger',
  FREE_TRIGGER = 'free_trigger',
}

type RequestHandler<
  ResponseBody = undefined,
  RequestBody = undefined,
  Query extends { [key: string]: string } = {}
> = {
  resBody: ResponseBody;
  reqBody: RequestBody;
  query: Query;
};

export enum METHOD {
  GET = 'get',
  POST = 'post',
}

export type BoardObject =
  | {
      image: undefined;
      buckets: BucketPosition[];
      color: Color;
      dropped?: number;
      id: number;
      shape: Shape;
      x: number;
      y: number;
    }
  // Image properties based
  | {
      image: string;
      buckets: BucketPosition[];
      color: undefined;
      dropped?: number;
      id: number;
      shape: undefined;
      x: number;
      y: number;
    };

export type Board = BoardObject[];

export type Transcript = { pos: number; bucketNo?: BucketPosition; code: Code; pieceId: number }[];

export type Display = {
  board: {
    longId: number;
    id: number;
    value: Board;
  };
  finishCode: FinishCode;
  numMovesMade: number;
  bonus: boolean;
  bonusEpisodeNo: number;
  canActivateBonus: boolean;
  episodeNo: number;
  guessSaved: boolean;
  seriesNo: number;
  totalBoardsPredicted: number;
  totalRewardEarned: number;
  transcript: Transcript;
  rulesSrc: {
    orders: number[];
    rows: string[];
  };
  ruleLineNo: number;
  movesLeftToStayInBonus?: number;
  transitionMap?: TransitionMap;
  ruleSetName: string;
  trialListId: string;
};

type Para = {
  clearing_threshold: number;
  max_points: number;
  b: number;
  min_points: number;
  max_colors: number;
  f: number;
  feedback_switches: FeedbackSwitches;
  min_objects: number;
  m: number;
  n: number;
  clear_how_many: number;
  bonus_extra_pts: number;
  rule_id: string;
  max_objects: number;
  grid_memory_show_order: boolean;
  min_shapes: number;
  stack_memory_show_order: boolean;
  max_shapes: number;
  min_colors: number;
  stack_memory_depth: number;
  max_boards: number;
  activate_bonus_at: number;
  give_up_at?: number;
};

export enum ErrorMsg {
  FAILED_TO_FIND_ANY_EPISODE = 'Failed to find any episode!',
  BONUS_ALREADY_ACTIVATED = 'Bonus already activated in the current series',
}

export type Endpoints = {
  '/game-data/GameService/writeFile': {
    [METHOD.POST]: RequestHandler<undefined, { dir: string; file: string; data: string }>;
  };
  '/game-data/GameService2/player': {
    [METHOD.POST]: RequestHandler<
      {
        errmsg: ErrorMsg;
        error: boolean;
        newlyRegistered: boolean;
        trialListId: string;
        trialList: Para[];
        completionCode?: string;
      },
      { playerId: string; exp?: string }
    >;
  };

  '/game-data/GameService2/mostRecentEpisode': {
    [METHOD.POST]: RequestHandler<
      {
        errmsg?: ErrorMsg;
        error: boolean;
        alreadyFinished: boolean;
        display: Display;
        episodeId: string;
        para: Para;
        completionCode?: string;
      },
      {
        playerId: string;
      }
    >;
  };

  '/game-data/GameService2/newEpisode': {
    [METHOD.POST]: RequestHandler<
      {
        errmsg?: ErrorMsg;
        error: boolean;
        alreadyFinished: boolean;
        display: Display;
        ruleSetName: string;
        trialListId: string;
        episodeId: string;
        para: Para;
        completionCode?: string;
      },
      {
        playerId: string;
      }
    >;
  };

  '/game-data/GameService2/display': {
    [METHOD.GET]: RequestHandler<Display, undefined, { episode: string }>;
  };

  '/game-data/GameService2/move': {
    [METHOD.POST]: RequestHandler<
      {
        board: {
          longId: number;
          id: number;
          value: Board;
        };
        bonus: boolean;
        code: Code;
        errmsg: ErrorMsg;
        error?: boolean;
        finishCode: FinishCode;
        numMovesMade: number;
        totalRewardEarned: number;
      },
      {
        episode: string;
        x: number;
        y: number;
        bx: number;
        by: number;
        cnt: number;
      }
    >;
  };

  '/game-data/GameService2/pick': {
    [METHOD.POST]: RequestHandler<
      {
        board: {
          longId: number;
          id: number;
          value: Board;
        };
        bonus: boolean;
        code: Code;
        errmsg: ErrorMsg;
        error?: boolean;
        finishCode: FinishCode;
        numMovesMade: number;
        totalRewardEarned: number;
      },
      {
        episode: string;
        x: number;
        y: number;
        cnt: number;
      }
    >;
  };

  '/game-data/GameService2/activateBonus': {
    [METHOD.POST]: RequestHandler<
      {
        errmsg: ErrorMsg;
        error: boolean;
      },
      { playerId: string }
    >;
  };

  '/game-data/GameService2/giveUp': {
    [METHOD.POST]: RequestHandler<
      {
        errmsg: ErrorMsg;
        error: boolean;
      },
      { playerId: string; seriesNo: number }
    >;
  };

  '/game-data/GameService2/guess': {
    [METHOD.POST]: RequestHandler<
      {
        errmsg: ErrorMsg;
        error: boolean;
        byteCnt: number;
        path: string;
      },
      { episode: string; data: string; confidence: number }
    >;
  };

  '/game-data/GameService2/colorMap': {
    [METHOD.GET]: RequestHandler<
      {
        [color: string]: [number, number, number];
      } & {
        errmsg: ErrorMsg;
        error?: boolean;
      }
    >;
  };

  '/admin/getSvg.jsp': {
    [METHOD.GET]: RequestHandler<
      string,
      undefined,
      {
        shape: string;
      }
    >;
  };

  '/game-data/GameService2/getVersion': {
    [METHOD.GET]: RequestHandler<number>;
  };
};

export type ResBody<
  E extends keyof Endpoints,
  M extends keyof Endpoints[E]
  // @ts-ignore
> = Endpoints[E][M]['resBody'];

export type ReqBody<
  E extends keyof Endpoints,
  M extends keyof Endpoints[E]
  // @ts-ignore
> = Endpoints[E][M]['reqBody'];

export type ReqQuery<
  E extends keyof Endpoints,
  M extends keyof Endpoints[E]
  // @ts-ignore
> = Endpoints[E][M]['query'];

export function api<T extends keyof Endpoints, U extends keyof Endpoints[T]>(
  route: T,
  method: U,
  body: ReqBody<T, U>,
  query: ReqQuery<T, U>,
): Promise<AxiosResponse<ResBody<T, U>>> {
  return axios({
    method: method as METHOD,
    url: `${API_HOST_ORIGIN}${route}`,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data: new URLSearchParams(body as { [key: string]: any }).toString(),
    headers:
      method === METHOD.POST
        ? {
            'Content-Type': 'application/x-www-form-urlencoded',
          }
        : undefined,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    params: query,
  }) as Promise<AxiosResponse<ResBody<T, U>>>;
}

export const getImageUrl = (image: string) => `${IMAGE_BASE_URL}?image=${image}`;
