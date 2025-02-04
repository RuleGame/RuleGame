import { ActionType } from 'typesafe-actions';
// Dependency cycle due to recursive type,
// and this does not affect the runtime of the code.
/* eslint-disable import/no-cycle */
import { ActionCreator } from 'typesafe-actions/dist/type-helpers';
import { ValuesType } from 'utility-types';
import * as page from './page';
import * as layers from './layers';
import * as ruleArrays from './rule-arrays';
import * as boardObjectsArrays from './board-objects-arrays';
import * as games from './games';
import * as notifications from './notifications';
import * as board from './board';
import * as debugMode from './debug-mode';
import * as socket from './socket';
import * as message from './message';
/* eslint-enable import/no-cycle */

export const actions = {
  page,
  layers,
  ruleArrays,
  boardObjectsArrays,
  games,
  notifications,
  board,
  debugMode,
  socket,
  message,
};

export type RootAction = ActionType<typeof actions>;

export declare type ActionCreatorType<
  A extends RootAction,
  TActionCreatorOrMap = typeof actions
> = TActionCreatorOrMap extends ActionCreator
  ? ValuesType<
      Pick<
        ReturnType<TActionCreatorOrMap>,
        // @ts-ignore
        'type'
      >
    > extends A['type']
    ? TActionCreatorOrMap
    : never // eslint-disable-next-line @typescript-eslint/no-explicit-any
  : TActionCreatorOrMap extends Record<any, any>
  ? {
      [K in keyof TActionCreatorOrMap]: ActionCreatorType<A, TActionCreatorOrMap[K]>;
    }[keyof TActionCreatorOrMap]
  : TActionCreatorOrMap extends infer R
  ? never
  : never;

export declare type RootActionCreatorType<
  TActionCreatorOrMap = typeof actions
> = TActionCreatorOrMap extends ActionCreator
  ? TActionCreatorOrMap // eslint-disable-next-line @typescript-eslint/no-explicit-any
  : TActionCreatorOrMap extends Record<any, any>
  ? {
      [K in keyof TActionCreatorOrMap]: ActionCreatorType<TActionCreatorOrMap[K]>;
    }[keyof TActionCreatorOrMap]
  : TActionCreatorOrMap extends infer R
  ? never
  : never;

export type RootActionType = { [K in keyof RootAction]: RootAction[K] }[keyof RootAction];
