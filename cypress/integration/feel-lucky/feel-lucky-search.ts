import { When, Then } from 'cypress-cucumber-preprocessor/steps';
import GoogleSearchPage from '../../pages/google/GoogleSearchPage';
import Browser from '../../pages/Browser';

When(/^Press 'Feel Lucky'$/, () => {
  GoogleSearchPage.pressFeelLucky();
});

Then(/^I am redirected to another domain$/, () => {
  Browser.expect().toBeInOtherDomain();
});
