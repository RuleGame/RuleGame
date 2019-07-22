import { When, Then } from 'cypress-cucumber-preprocessor/steps';
import GoogleSearchPage from '../../pages/google/GoogleSearchPage';
import GoogleResultsPage from '../../pages/google/GoogleResultsPage';

When(/^Press 'Search'$/, () => {
  GoogleSearchPage.pressSearch();
});

Then(/^I have some results$/, () => {
  GoogleResultsPage.expect().toHaveResults();
});
