import { Given, Then, When } from 'cypress-cucumber-preprocessor/steps';
import GoogleResultsPage from '../../pages/google/GoogleResultsPage';
import GoogleSearchPage from '../../pages/google/GoogleSearchPage';
import executeCommand from '../../common/execute-command';

Given(/^I execute a long task in my database$/, () => {
  executeCommand('db-command-long-task');
});

When(/^Press 'Search'$/, () => {
  GoogleSearchPage.pressSearch();
});

Then(/^I have some results$/, () => {
  GoogleResultsPage.expect().toHaveResults();
});
