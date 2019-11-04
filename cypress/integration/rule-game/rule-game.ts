import { Then, When } from 'cypress-cucumber-preprocessor/steps';
import RuleGamePage from '../../pages/RuleGamePage';
import { Game } from '../../../src/@types';

When('I drag and drop the blue square', () => {
  RuleGamePage.getGame(Game.GAME1).click();

  RuleGamePage.dragNDropObject(RuleGamePage.blueSquareSelector, RuleGamePage.bucketSelector);
});

Then('it works', () => {
  expect(true).to.be.true;
});
