import { entranceButtonCy, shapeObjectCy } from '../../src/constants/data-cy-builders';
import { buckets } from '../../src/constants';
import { Game, Shape } from '../../src/@types';

// TODO: Extract this fn to a util:
const createDataCySelector = (dataCyValue: string) => `[data-cy=${dataCyValue}]`;

class RuleGamePage {
  public static getGame(game: Game) {
    return cy.get(createDataCySelector(entranceButtonCy(game)));
  }

  public static get blueSquareSelector() {
    return createDataCySelector(shapeObjectCy('0', Shape.SQUARE));
  }

  public static get bucketSelector() {
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
