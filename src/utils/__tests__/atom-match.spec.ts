import atomMatch from '../atom-match';
import { Color, Shape } from '../../@types';

it('matches', () => {
  expect(
    atomMatch({ x: 2, y: 1, color: Color.BLACK, id: '1', shape: Shape.CIRCLE }, { 1: 2 })({
      position: 10,
      counter: 2,
      shape: Shape.CIRCLE,
      id: '1',
      color: Color.BLACK,
      fns: [],
    }),
  ).toEqual(true);
});

it('does not match on position', () => {
  expect(
    atomMatch({ x: 2, y: 1, color: Color.BLACK, id: '1', shape: Shape.CIRCLE }, { 1: Infinity })({
      position: 12,
      counter: 2,
      shape: Shape.ANY,
      id: '1',
      color: Color.ANY,
      fns: [],
    }),
  ).toEqual(false);
});

it('does not match on counter', () => {
  expect(
    atomMatch({ x: 2, y: 1, color: Color.BLACK, id: '1', shape: Shape.CIRCLE }, { 1: 0 })({
      position: NaN,
      counter: 2,
      shape: Shape.ANY,
      id: '1',
      color: Color.ANY,
      fns: [],
    }),
  ).toEqual(false);
});

it('does not match on shape', () => {
  expect(
    atomMatch({ x: 2, y: 1, color: Color.BLACK, id: '1', shape: Shape.CIRCLE }, { 1: Infinity })({
      position: NaN,
      counter: 2,
      shape: Shape.TRIANGLE,
      id: '1',
      color: Color.ANY,
      fns: [],
    }),
  ).toEqual(false);
});

it('does not match on color', () => {
  expect(
    atomMatch({ x: 2, y: 1, color: Color.BLACK, id: '1', shape: Shape.CIRCLE }, { 1: Infinity })({
      position: NaN,
      counter: 2,
      shape: Shape.ANY,
      id: '1',
      color: Color.BLUE,
      fns: [],
    }),
  ).toEqual(false);
});

it('accepts anys', () => {
  expect(
    atomMatch({ x: 2, y: 1, color: Color.BLACK, id: '1', shape: Shape.CIRCLE }, { 1: Infinity })({
      position: NaN,
      counter: 2,
      shape: Shape.ANY,
      id: '1',
      color: Color.ANY,
      fns: [],
    }),
  ).toEqual(true);
});
