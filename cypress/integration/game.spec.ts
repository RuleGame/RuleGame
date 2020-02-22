// eslint-disable-next-line
/// <reference types="cypress" />
import createSagaMiddleware, { SagaMiddleware } from 'redux-saga';
import { enterGame, loadGames } from '../../src/store/actions/games';
import { CY_GAME, CY_NO_MORE_MOVES } from '../../src/constants/data-cy';
import { cySelector, cyShapeObject } from '../../src/constants/data-cy-builders';
import { BucketPosition, Shape } from '../../src/@types';
import { move } from '../../src/store/actions/rule-row';
import { FEEDBACK_DURATION } from '../../src/store/epics/rule-row';

describe('order', () => {
  const gameId = 'jVF1D_0s';
  // const boardObjectsArraysId = '0vFyGvU9';
  let sagaMiddleware: SagaMiddleware;

  before(() => {
    cy.visit('/');
    sagaMiddleware = createSagaMiddleware();
    cy.addMiddleware(sagaMiddleware);
    cy.fixture('order.json').then((s) => {
      cy.take(
        loadGames.request(new File([JSON.stringify(s)], 'temp')),
        sagaMiddleware,
        loadGames.success,
      );
    });
  });

  beforeEach(() => {
    cy.window().then((win: Window) => {
      const { dispatch } = win.store;
      dispatch(enterGame(gameId));
      cy.get(cySelector(CY_GAME)).should('be.visible');
    });
  });

  it('orders from least to greatest', () => {
    const greaterObject = '1';
    const lesserObject = '2';

    cy.take(move({ dragged: lesserObject, dropped: BucketPosition.BL }), sagaMiddleware, move);
    cy.get(`${cySelector(cyShapeObject(lesserObject))}[data-shape="${Shape.CIRCLE}"]`).should(
      'be.visible',
    );

    cy.take(move({ dragged: greaterObject, dropped: BucketPosition.BL }), sagaMiddleware, move);
    cy.wait(1.25 * FEEDBACK_DURATION);
    cy.get(`${cySelector(cyShapeObject(greaterObject))}[data-shape="${Shape.CHECK}"]`).should(
      'be.visible',
    );

    cy.take(move({ dragged: lesserObject, dropped: BucketPosition.BL }), sagaMiddleware, move);
    cy.wait(1.25 * FEEDBACK_DURATION);
    cy.get(`${cySelector(cyShapeObject(lesserObject))}[data-shape="${Shape.CHECK}"]`).should(
      'be.visible',
    );

    cy.get(cySelector(CY_NO_MORE_MOVES)).should('be.visible');
  });
});
