import { Store } from 'redux';
import { SagaIterator, SagaMiddleware } from 'redux-saga';
import { take as sagaTake, delay, race } from 'redux-saga/effects';
import { getType } from 'typesafe-actions';
import { ActionCreator, ActionCreatorTypeMetadata } from 'typesafe-actions/dist/type-helpers';
import { RootAction } from '../../src/store/actions';
import { RootState } from '../../src/store/reducers';
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
  actionCreator: ActionCreator & ActionCreatorTypeMetadata<string>,
  match?: Record<string, Partial<RootAction>>,
  timeout: number = 4000,
) => {
  cy.log(`${getType(actionCreator)}${match ? ` with ${JSON.stringify(match)}` : ''}`);
  cy.wrap(
    new Promise((resolve, reject) => {
      sagaMiddleware.run(function*(): SagaIterator {
        cy.dispatch(putAction);
        const { timedOut } = yield race({
          timedOut: delay(timeout),
          success: sagaTake(
            (action: RootAction) =>
              action.type === getType(actionCreator) &&
              (!match ||
                Object.entries(match).every(
                  ([key, value]) => (action as Record<string, Partial<RootAction>>)[key] === value,
                )),
          ),
        });
        if (timedOut) {
          reject(
            new Error(
              `Timed out take action ${getType(actionCreator)}${
                match ? ` with ${JSON.stringify(match)}` : ''
              }`,
            ),
          );
        }
        resolve(
          `${getType(actionCreator)}${match ? ` with ${JSON.stringify(match)} ` : 'dispatched'}`,
        );
      });
    }),
  );
};

const dispatch = (action: RootAction) => {
  cy.log('dispatch');
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
