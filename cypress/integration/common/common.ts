import { Given } from 'cypress-cucumber-preprocessor/steps';
import RuleGamePage from '../../pages/RuleGamePage';

Given("I'm at Rule Game", () => {
  RuleGamePage.visit();
});
