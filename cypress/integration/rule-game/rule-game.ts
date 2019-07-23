import { Then, When } from 'cypress-cucumber-preprocessor/steps';
import RuleGamePage from '../../pages/RuleGamePage';

When('I drag and drop the blue square', () => {
  RuleGamePage.dragNDropObject(RuleGamePage.blueSquare, RuleGamePage.bucket);
});

Then('it works', () => {
  expect(true).to.be.true;
});
