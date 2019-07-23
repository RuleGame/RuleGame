import { shapeObjectCy } from '../../src/constants/data-cy-builders';
import { initialBoardObjects, buckets } from '../../src/constants/index';
import { BoardObjectType } from '../../src/@types/index';

// TODO: Extract this fn to a util:
const createDataCySelector = (dataCyValue: string) => `[data-cy=${dataCyValue}]`;

class RuleGamePage {
  public static get blueSquare() {
    return cy.get(
      createDataCySelector(
        shapeObjectCy(
          (initialBoardObjects.find(
            (b) => b.color === 'blue' && b.shape === 'square',
          ) as BoardObjectType).id,
          'square',
        ),
      ),
    );
  }

  public static get bucket() {
    return cy.get(createDataCySelector(shapeObjectCy(buckets[0].id, 'bucket')));
  }

  public static visit() {
    cy.visit('/');
  }

  public static dragNDropObject(
    dragObject: Cypress.Chainable<JQuery<HTMLElement>>,
    dropObject: Cypress.Chainable<JQuery<HTMLElement>>,
  ) {
    cy.dragNDrop(dragObject, dropObject);
  }
}

export default RuleGamePage;
