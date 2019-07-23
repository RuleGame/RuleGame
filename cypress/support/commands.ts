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

export const dragNDrop = (
  drag: Cypress.Chainable<JQuery<HTMLElement>>,
  drop: Cypress.Chainable<JQuery<HTMLElement>>,
) => {
  drop.then(($dropEl) =>
    drag
      .trigger('mousedown', { which: 1 })
      .trigger('mousemove', {
        clientX: $dropEl[0].getBoundingClientRect().left,
        clientY: $dropEl[0].getBoundingClientRect().top,
      })
      .trigger('mouseup', { force: true }),
  );
}; // False positive, TS will check for undefined errors here. // @ts-ignore

// add new command to the existing Cypress interface
/* eslint-disable no-undef */ declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Cypress {
    // eslint-disable-next-line @typescript-eslint/interface-name-prefix
    interface Chainable {
      dragNDrop: typeof dragNDrop;
    }
  }
}
/* eslint-disable no-undef */

Cypress.Commands.add('dragNDrop', dragNDrop);
