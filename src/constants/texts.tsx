import React from 'react';
import { Box, Button, Heading, Paragraph, Text } from 'grommet';
import { Page } from './Page';

import { HAS_UID } from '.';

export default {
  [Page.CONSENT]: {
    checkBoxLabel: 'By clicking this box, I consent to participate in this task.',
    nextButtonLabel: 'Start Experiment',
  },

  [Page.INTRODUCTION]: {
    backButtonLabel: 'Back',
    nextButtonLabel: 'Next',
    // Replaces the next button label for the very last instruction page
    startExperimentButtonLabel: 'Start',
    // For the help page that opens in another tab via clicking the help button
    helpMessage: 'When you are done reading, please close this tab to return to the Rule Game.',
  },

  [Page.LOADING_TRIALS]: {
    text: 'Loading Trials...',
  },

  [Page.WAITING]: {
    text: 'Waiting for other player to start an episode...',
  },

  [Page.TRIALS]: {
    // Titles are displayed above the board. ruleNum is the current rule number starting from 1.
    ruleTitle: (ruleNum: number) => `Rule ${ruleNum}`,
    bonusTitle: (ruleNum: number) => `Rule ${ruleNum} (Bonus Round)`,

    giveUpButtonLabel: 'Give up on this rule',
    // A warning pops up after clicking the give up button confirming the give up action.
    giveUpConfirmationWarning: (ruleNum: number) =>
      `Are you sure you want to give up Rule ${ruleNum} and advance to the next rule if any?`,
    giveUpYesConfirmationLabel: 'Yes',
    giveUpNoConfirmationLabel: 'No',

    // Bonus only: Displayed below the board after board has no more moves.
    bonusSuccessMessage: 'Board successfully cleared!',
    bonusFailureMessage: 'No more moves left!',

    // Button below the board after the board has no more moves.
    nextBonusRoundButtonLabel: 'Next Bonus Round',
    lastBonusRoundButtonWonLabel: 'Next Rule (Bonus Completed)',
    lastBonusRoundButtonLostLabel: 'Next Rule (Bonus Lost)',

    activateBonusRoundsButtonLabel: (
      <Text color="white" size="large" weight="bold">
        <Box>Think you got it?</Box>
        <Box>Activate bonus rounds!</Box>
      </Text>
    ),
    bonusRoundsActivatedMessage: 'Bonus activated next round!',

    numMovesMadePreText: 'Number of moves made:',
    numMovesLeftPreText: 'Number of moves left:',
    pointsPreText: 'Points:',
    boardNumText: (boardNum: number, numBoardsLeft: number) => (
      <Box wrap direction="row" align="baseline">
        <Text size="inherit" weight="bold">
          Board&nbsp;
        </Text>
        <Text size="1.25em" weight="bold">
          {boardNum} of {numBoardsLeft}
        </Text>
      </Box>
    ),

    guessButtonLabel: 'Guess the rule',
    guessRulePrompt: 'What is the rule?',
    confidenceScalePrompt: 'How sure are you?',
    leastConfidentLabel: 'Just guessing',
    greatestConfidentLabel: 'Completely sure',

    // Reuse label shown on hovering over the button.
    reusePreviousResponseLabel: 'Fill with previous response',

    instructionsButtonLabel: 'Open instructions in a new tab',

    stalematePrompt:
      'You have cleared all the pieces this rule requires. Please enter your guess to continue',
  },

  [Page.DEMOGRAPHICS_INSTRUCTIONS]: {
    text: "Thank you! We'll now ask a few questions, and you'll be done!",
  },

  [Page.DEBRIEFING]: {
    text: (completionCode: string) => (
      <>
        <Heading>Thank you for participating!</Heading>
        {!HAS_UID ? (
          <Paragraph fill>
            Your completion code is <Text weight="bold">{completionCode}</Text>. Please paste the
            code into the mTurk Box.
          </Paragraph>
        ) : (
          <Paragraph fill>
            For your reference, your completion code is <Text weight="bold">{completionCode}</Text>.
          </Paragraph>
        )}
        <Paragraph fill>
          We’re using this task to better understand what kinds of rules are easy and hard for
          people compared to machine learning algorithms.
        </Paragraph>
        {!HAS_UID ? (
          <Paragraph fill>You may now close this window.</Paragraph>
        ) : (
          <Box>
            <Paragraph>
              {"You've done a good job, now click on this button to go back to the launch page."}
            </Paragraph>
            <Button primary onClick={() => window.history.back()} label="Return" />
          </Box>
        )}
      </>
    ),
  },

  // Large prompt displayed when browser is not in fullscreen
  fullscreenPrompt: 'Fullscreen is required',
  fullscreenButtonLabel: 'Enter fullscreen',
};
