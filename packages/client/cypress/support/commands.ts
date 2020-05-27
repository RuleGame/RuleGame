import { Store } from 'redux';
import createSagaMiddleware, { SagaIterator, SagaMiddleware } from 'redux-saga';
import { delay, race, take as sagaTake } from 'redux-saga/effects';
import { getType } from 'typesafe-actions';
import isMatch from 'lodash/isMatch';
import shortid from 'shortid';
import { Optional } from 'utility-types';
import { RootAction, RootActionCreatorType } from '../../src/store/actions';
import { RootState } from '../../src/store/reducers';
import { addRuleArray } from '../../src/store/actions/rule-arrays';
import { addBoardObjectsArray } from '../../src/store/actions/board-objects-arrays';
import { BoardObjectType } from '../../src/@types';
import { addGame, enterGame } from '../../src/store/actions/games';
import { xYToPosition } from '../../src/utils/atom-match';
// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This is will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })

const reactDnd = (sourceSelector: string, targetSelector: string) => {
  /* eslint-disable cypress/no-unnecessary-waiting */
  cy.wait(500);
  cy.get(sourceSelector).trigger('dragstart', { force: true });
  // may be possible that the targetselector is <img /> because can't drop
  // on undroppable div
  cy.get(targetSelector).trigger('drop', { force: true });
  cy.wait(500);
  cy.get(targetSelector).trigger('dragend', { force: true });
  /* eslint-enable cypress/no-unnecessary-waiting */
};

const take = (
  putAction: RootAction,
  sagaMiddleware: SagaMiddleware,
  match: RootAction | RootActionCreatorType,
  timeout: number = 4000,
) => {
  if (typeof match === 'function') {
    getType(match);
    cy.log(`CY TAKE with action of type ${getType(match)}`);
  } else {
    cy.log(`CY TAKE with action containing ${JSON.stringify(match)}`);
  }
  cy.wrap(
    new Promise((resolve, reject) => {
      sagaMiddleware.run(function*(): SagaIterator {
        cy.dispatch(putAction);
        const { timedOut } = yield race({
          timedOut: delay(timeout),
          success: sagaTake((action: RootAction) => {
            if (typeof match === 'function') {
              return action.type === getType(match);
            }
            return isMatch(action, match);
          }),
        });
        if (timedOut) {
          let timedOutMessage = 'CY TAKE timed out with action ';
          if (typeof match === 'function') {
            getType(match);
            timedOutMessage += `of type ${getType(match)}`;
          } else {
            timedOutMessage += `containing ${JSON.stringify(match)}`;
          }
          cy.log(timedOutMessage);
          reject(new Error(timedOutMessage));
        }

        let takenMessage = 'CY TAKE successfully taken with action ';
        if (typeof match === 'function') {
          getType(match);
          takenMessage += `of type ${getType(match)}`;
        } else {
          takenMessage += `containing ${JSON.stringify(match)}`;
        }
        cy.log(takenMessage);
        resolve(takenMessage);
      });
    }),
  );
};

const dispatch = (action: RootAction) => {
  cy.log(`dispatch ${JSON.stringify(action)}`);
  cy.window().then((win: Window) => {
    const { dispatch } = win.store;
    dispatch(action);
  });
};

const addMiddleware = (middleware: SagaMiddleware) => {
  cy.window().then((win: Window) => {
    const { dynamicMiddlewaresInstance } = win;

    dynamicMiddlewaresInstance.addMiddleware(middleware);
  });
};

const removeMiddleware = (middleware: SagaMiddleware) => {
  cy.window().then((win: Window) => {
    const { dynamicMiddlewaresInstance } = win;

    dynamicMiddlewaresInstance.removeMiddleware(middleware);
  });
};

const addAndEnterGame = (
  ruleArray: string,
  boardObjectsArray: Optional<BoardObjectType, 'id'>[],
  numConsecutiveSuccessfulMovesBeforePromptGuess?: number,
  restartIfNotCleared?: boolean,
) => {
  const sagaMiddleware = createSagaMiddleware();
  const ruleArrayId = shortid();
  const boardObjectsArrayId = shortid();
  const gameId = shortid();

  cy.addMiddleware(sagaMiddleware);
  cy.take(
    addRuleArray.request(ruleArrayId, ruleArray, undefined, ruleArrayId),
    sagaMiddleware,
    addRuleArray.success,
  );
  cy.take(
    addBoardObjectsArray.success(
      boardObjectsArrayId,
      boardObjectsArrayId,
      boardObjectsArray.map<BoardObjectType>((boardObject) =>
        boardObject.id
          ? (boardObject as BoardObjectType)
          : // eslint-disable-next-line @typescript-eslint/no-object-literal-type-assertion
            ({
              ...boardObject,
              id: String(xYToPosition(boardObject.x, boardObject.y)),
            } as BoardObjectType),
      ),
      '',
    ),
    sagaMiddleware,
    addBoardObjectsArray.success,
  );
  cy.take(
    addGame(
      gameId,
      ruleArrayId,
      [boardObjectsArrayId],
      false,
      0,
      numConsecutiveSuccessfulMovesBeforePromptGuess,
      gameId,
      restartIfNotCleared,
    ),
    sagaMiddleware,
    addGame,
  );
  cy.take(enterGame(gameId), sagaMiddleware, enterGame);
  cy.removeMiddleware(sagaMiddleware);
};

// False positive, TS will check for undefined errors here.
// add new command to the existing Cypress interface
/* eslint-disable no-undef */
// @ts-ignore
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace,no-redeclare
  namespace Cypress {
    // eslint-disable-next-line @typescript-eslint/interface-name-prefix
    interface Chainable {
      reactDnd: typeof reactDnd;
      take: typeof take;
      dispatch: typeof dispatch;
      addMiddleware: typeof addMiddleware;
      removeMiddleware: typeof removeMiddleware;
      addAndEnterGame: typeof addAndEnterGame;
    }
  }

  interface Window {
    store: Store<RootState, RootAction>;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Cypress: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    dynamicMiddlewaresInstance: any;
  }
}
/* eslint-disable no-undef */

Cypress.Commands.add('reactDnd', reactDnd);
Cypress.Commands.add('take', take);
Cypress.Commands.add('dispatch', dispatch);
Cypress.Commands.add('addMiddleware', addMiddleware);
Cypress.Commands.add('removeMiddleware', removeMiddleware);
Cypress.Commands.add('addAndEnterGame', addAndEnterGame);
