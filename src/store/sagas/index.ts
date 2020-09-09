import { all } from 'typed-redux-saga';
import trials from './trials';

export default function* rootSaga() {
  yield* all([trials()]);
}
