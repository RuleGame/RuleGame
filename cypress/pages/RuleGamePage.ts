import { shapeObjectCy } from '../../src/constants/data-cy-builders';
import { initialBoardObjects, buckets } from '../../src/constants/index';
import { BoardObjectType } from '../../src/@types/index';

// TODO: Extract this fn to a util:
const createDataCySelector = (dataCyValue: string) => `[data-cy=${dataCyValue}]`;

class RuleGamePage {
  public static get blueSquare() {
    return createDataCySelector(
      shapeObjectCy(
        (initialBoardObjects.find(
          (b) => b.color === 'blue' && b.shape === 'square',
        ) as BoardObjectType).id,
        'square',
      ),
    );
  }

  public static get bucket() {
    return createDataCySelector(shapeObjectCy(buckets[0].id, 'bucket'));
  }

  public static visit() {
    cy.visit('/');
  }

  public static dragNDropObject(dragObject: string, dropObject: string) {
    cy.reactDnd(dragObject, dropObject);
  }
}

export default RuleGamePage;
