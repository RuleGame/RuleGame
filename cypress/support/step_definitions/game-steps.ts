import { Given, When, Then } from 'cypress-cucumber-preprocessor/steps';
import createSagaMiddleware, { SagaMiddleware } from 'redux-saga';
import { BucketPosition, Shape } from '../../../src/@types';
import { enterGame, loadGames } from '../../../src/store/actions/games';
import { enableDebugMode, move } from '../../../src/store/actions/rule-row';
import { FEEDBACK_DURATION } from '../../../src/store/epics/rule-row';
import { cySelector, cyShapeObject } from '../../../src/constants/data-cy-builders';
import { CY_GAME, CY_NO_MORE_MOVES } from '../../../src/constants/data-cy';

let sagaMiddleware: SagaMiddleware;

const checkMove = (object: string, isValid: boolean) => {
  cy.take(move({ dragged: object, dropped: BucketPosition.BL }), sagaMiddleware, move);
  cy.wait(1.25 * FEEDBACK_DURATION);
  cy.get(`${cySelector(cyShapeObject(object))}[data-shape="${Shape.CHECK}"]`).should(
    isValid ? 'be.visible' : 'not.be.visible',
  );
};

Given(/^game is (.*)$/, (game: string) => {
  cy.visit('/');
  sagaMiddleware = createSagaMiddleware();
  cy.addMiddleware(sagaMiddleware);
  cy.fixture('basics.json').then((s) => {
    cy.take(
      loadGames.request(new File([JSON.stringify(s)], 'temp')),
      sagaMiddleware,
      loadGames.success,
    );
  });
  cy.dispatch(enableDebugMode());
  cy.dispatch(enterGame('counter'));
  cy.get(cySelector(CY_GAME)).should('be.visible');
});

When(/^I drag (.*) to (\d+)$/, (object: string, bucket: BucketPosition) => {
  checkMove(object, true);
});

Then(/^display is cleared$/, () => {
  cy.get(cySelector(CY_NO_MORE_MOVES)).should('be.visible');
});
