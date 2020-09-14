import { call, SagaGenerator, take } from 'typed-redux-saga';
import { getType } from 'typesafe-actions';
import { AxiosResponse } from 'axios';
import { CallEffect } from 'redux-saga/effects';
import { RootActionCreatorType } from '../../actions';
import { api, Endpoints, ReqBody, ReqQuery, ResBody } from '../../../utils/api';

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
