import shortid from 'shortid';
import range from 'lodash/range';
import shuffle from 'lodash/shuffle';
import sample from 'lodash/sample';
import { BoardObjectType, Color, Shape } from '../../../@types';
import { borderHeight, borderWidth, colors, cols, rows, shapes } from '../../../constants';

const randomObjectsCreator = (
  numObjects: number,
  initialObjectsList?: BoardObjectType[],
): BoardObjectType[] => {
  if (initialObjectsList) {
    const { takenX, takenY } = initialObjectsList.reduce(
      (acc, curr) => ({
        ...acc,
        takenX: acc.takenX.add(curr.x),
        takenY: acc.takenY.add(curr.y),
      }),
      {
        takenX: new Set<number>(),
        takenY: new Set<number>(),
      },
    );
    const numAdditionalObjects = numObjects - initialObjectsList.length;
    const availableX = shuffle(
      range(borderWidth, cols - borderWidth).filter((x) => !takenX.has(x)),
    );
    const availableY = shuffle(
      range(borderHeight, rows - borderHeight).filter((y) => !takenY.has(y)),
    );
    const availableColors = range(numAdditionalObjects).map(() => sample(colors) as Color);
    const availableShapes = range(numAdditionalObjects).map(() => sample(shapes) as Shape);

    return range(numAdditionalObjects)
      .map((i) => ({
        id: shortid(),
        color: availableColors[i],
        shape: availableShapes[i],
        x: availableX[i],
        y: availableY[i],
      }))
      .concat(initialObjectsList);
  }

  const availableX = shuffle(range(1, cols - 1));
  const availableY = shuffle(range(1, rows - 1));
  const availableColors = range(numObjects).map(() => sample(colors) as Color);
  const availableShapes = range(numObjects).map(() => sample(shapes) as Shape);

  return range(numObjects).map((i) => ({
    id: shortid(),
    color: availableColors[i],
    shape: availableShapes[i],
    x: availableX[i],
    y: availableY[i],
  }));
};

export default randomObjectsCreator;
