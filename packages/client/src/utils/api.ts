import axios, { AxiosResponse } from 'axios';
import { BucketPosition, Color, Shape } from '../@types';

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

export type Endpoints = {
  '/trial': {
    [METHOD.GET]: RequestHandler<{ trials: [] }, undefined, { workerId: string }>;
  };
  '/data': {
    [METHOD.POST]: RequestHandler<{}, { trials: string }>;
  };
  '/w2020/game-data/GameService/writeFile': {
    [METHOD.POST]: RequestHandler<undefined, { dir: string; file: string; data: string }>;
  };
  '/w2020/game-data/GameService/startTrial': {
    [METHOD.POST]: RequestHandler<
      {
        clearing_threshold: number;
        max_points: number;
        b: number;
        min_points: number;
        max_colors: number;
        f: number;
        feedback_switches: string;
        min_objects: number;
        m: number;
        n: number;
        clear_how_many: number;
        bonus_extra_points: number;
        rule_id: number;
        max_objects: number;
        grid_memory_show_order: boolean;
        min_shapes: number;
        stack_memory_show_order: boolean;
        max_shapes: number;
        min_colors: number;
        stack_memory_depth: number;
        max_boards: number;
        activate_bonus_at: number;
      },
      { playerId: string }
    >;
  };
  '/w2020/game-data/GameService/newEpisode': {
    [METHOD.POST]: RequestHandler<
      {
        board: {
          longId: number;
          id: number;
          value: {
            buckets: BucketPosition[];
            color: Color;
            id: number;
            shape: Shape;
            x: number;
            y: number;
            dropped?: BucketPosition;
          }[];
        };
        episodeId: string;
        errmsg?: string;
        error: boolean;
      },
      {
        rules: string;
        pieces: number;
        shapes: number;
        colors: number;
      }
    >;
  };
  '/w2020/game-data/GameService/display': {
    [METHOD.GET]: RequestHandler<
      {
        attemptCnt: number;
        board: {
          longId: number;
          id: number;
          value: {
            buckets: BucketPosition[];
            color: Color;
            id: number;
            shape: Shape;
            x: number;
            y: number;
          }[];
        };
        code: number;
        errmsg?: string;
        finishCode: number;
      },
      undefined,
      { episode: string }
    >;
  };
  '/w2020/game-data/GameService/move': {
    [METHOD.POST]: RequestHandler<
      {
        attemptCnt: number;
        board: {
          longId: number;
          id: number;
          value: {
            buckets: BucketPosition[];
            color: Color;
            id: number;
            shape: Shape;
            x: number;
            y: number;
          }[];
        };
        code: number;
        errmsg?: string;
        finishCode: number;
      },
      {
        x: number;
        y: number;
        bx: number;
        by: number;
        cnt: number;
      }
    >;
  };
};

type Move = {
  objectId?: string;
  bucketId?: string;
  boardId?: string;
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
) {
  return axios({
    method: method as METHOD,
    url: `http://localhost:7150${route}`,
    data: body,
    headers:
      method === METHOD.POST
        ? {
            'Content-Type': 'application/x-www-form-urlencoded',
          }
        : undefined,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    params: new URLSearchParams(query as { [key: string]: any }).toString(),
  }) as Promise<AxiosResponse<ResBody<T, U>>>;
}
