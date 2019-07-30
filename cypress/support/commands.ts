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

export const reactDnd = (sourceSelector: string, targetSelector: string) => {
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

// False positive, TS will check for undefined errors here.
// add new command to the existing Cypress interface
/* eslint-disable no-undef */
// @ts-ignore
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Cypress {
    // eslint-disable-next-line @typescript-eslint/interface-name-prefix
    interface Chainable {
      reactDnd: typeof reactDnd;
    }
  }
}
/* eslint-disable no-undef */

Cypress.Commands.add('reactDnd', reactDnd);
