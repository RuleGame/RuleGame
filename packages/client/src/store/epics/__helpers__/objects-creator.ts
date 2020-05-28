import shortid from 'shortid';
import range from 'lodash/range';
import sample from 'lodash/sample';
import sampleSize from 'lodash/sampleSize';
import { BoardObjectType, Color, Shape } from '../../../@types';
import { colors, cols, rows, shapes } from '../../../constants';
import { positionToXy } from '../../../utils/atom-match';

export const getValidPositions = (cols: number, rows: number) =>
  range(1, (cols - 2) * (rows - 2) + 1);

const randomObjectsCreator = (numObjects: number): BoardObjectType[] =>
  sampleSize(getValidPositions(cols, rows), numObjects).map((pos) => ({
    id: shortid(),
    color: sample(colors) as Color,
    shape: sample(shapes) as Shape,
    x: positionToXy(pos).x,
    y: positionToXy(pos).y,
  }));

export default randomObjectsCreator;
