import GoogleResultsPage from './GoogleResultsPage';

const SEARCH_FIELD = 'input[type=text]';
const SEARCH_BUTTON = 'input[type=submit]';
const SEARCH_TEXT = 'Search';
const FEEL_LUCKY_BUTTON = 'input[type=submit]';
const FEEL_LUCKY_TEXT = 'suerte';

class GoogleSearchPage {
  public static visit() {
    cy.visit('/');
  }

  public static type(query: string) {
    cy.get(SEARCH_FIELD) // 2 seconds
      .type(query);
  }

  public static pressSearch() {
    cy.get(SEARCH_BUTTON)
      .contains(SEARCH_TEXT)
      .click();
    return new GoogleResultsPage();
  }

  public static pressFeelLucky() {
    cy.get(FEEL_LUCKY_BUTTON)
      .contains(FEEL_LUCKY_TEXT)
      .click();
  }
}

export default GoogleSearchPage;
