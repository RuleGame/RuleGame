class Browser {
  // You can use Browser class to do some typical things, like
  // login, etc.

  public static expect() {
    return {
      toBeInOtherDomain: () => cy.url().should('not.include', 'google'),
    };
  }
}

export default Browser;
