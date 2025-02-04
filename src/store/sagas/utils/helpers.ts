import { call, SagaGenerator, take } from 'typed-redux-saga';
import { getType } from 'typesafe-actions';
import { AxiosResponse } from 'axios';
import { CallEffect } from 'redux-saga/effects';
import { RootActionCreatorType } from '../../actions';
import {
  api,
  Endpoints,
  ReqBody,
  ReqQuery,
  ResBody,
  EventRequest,
  EventResponse,
  Events,
  EventQuery,
} from '../../../utils/api';

export function* takeAction<T extends RootActionCreatorType>(actionCreator: T) {
  return yield* take<ReturnType<T>>(getType(actionCreator));
}

// eslint-disable-next-line require-yield
export function* apiResolve<T extends keyof Endpoints, U extends keyof Endpoints[T]>(
  route: T,
  method: U,
  body: ReqBody<T, U>,
  query: ReqQuery<T, U>,
  // @ts-ignore
): SagaGenerator<AxiosResponse<ResBody<T, U>>, CallEffect> {
  // @ts-ignore
  return yield* call(api, route, method, body, query);
}

// Socket communication generator function
export function* socketResolve<E extends keyof Events>(
  event: E,
  request: EventRequest<E>,
  query: EventQuery<E>,
): SagaGenerator<EventResponse<E>, CallEffect> {
  // @ts-ignore
  return yield* call([socket, socket.emit], event, request, query);
}
