import React from 'react';
import { Box, Heading, Image, Paragraph, Text } from 'grommet';
import { Page } from './Page';
import HappyFace from '../assets/smiley-face.png';

export default {
  [Page.CONSENT]: {
    text: (
      <>
        <Box width="small" height="small">
          <Image src={HappyFace} fill />
        </Box>
        <Paragraph fill>
          {`The HIT you are about to do is sponsored by University of Wisconsin-Madison. It is part
            of a protocol titled “Language and Human Cognition”. The task you are asked to do
            involves making simple responses to images, text, and/or sounds. For example, you may be
            asked how typical a picture of a dog is of dogs in general, to name a drawing, decide
            what word a sound makes you think of, to choose which visual pattern best completes a
            sequence of patterns, or indicate how vividly you see in your “mind’s eye."`}
          <strong>HIT instructions will be provided on the next screen. </strong>
        </Paragraph>
        <Paragraph fill>
          {`This task has no anticipated risks nor direct benefits. If you have any questions or
            concerns about this HIT please contact the principal investigator: Dr. Gary Lupyan at
            lupyan@wisc.edu. If you are not satisfied with response of the research team, have more
            questions, or want to talk with someone about your rights as a research participant, you
            should contact University of Wisconsin’s Education Research and Social & Behavioral
            Science IRB Office at 608-263-2320. You are free to decline to participate or to end
            participation at any time for any reason.`}
        </Paragraph>
      </>
    ),
    checkBoxLabel: 'By clicking this box, I consent to participate in this task.',
    nextButtonLabel: 'Start Experiment',
  },

  [Page.INTRODUCTION]: {
    text: (numRules: number | string) =>
      // A list of JSX (HTML). One per instruction page.
      // Players can navigate through them via back and next buttons.
      [
        // Page 1
        <>
          <Heading>RuleGame Challenge</Heading>
          <Paragraph fill>
            Welcome to the RuleGame challenge. There are {numRules} different rules. Each rule
            describes an allowed way of clearing some <b>colored objects</b> from a game board. To
            clear an object, you must grab it with the mouse, and drag it to the correct bucket.
            When you release it at the correct bucket, the bucket smiles, and the object’s place
            turns into a check mark. If you release it at the wrong bucket, the bucket makes an ugly
            face. After you have cleared an entire display, you can give up, or ask for a new
            display. After you have cleared a few displays without too many errors, you can take a
            chance to guess at the rule. Please be patient after you guess because we require human
            judges to review your guesses.
          </Paragraph>
        </>,

        // Page 2
        <>
          <Heading>RuleGame Challenge</Heading>
          <Paragraph fill>Instruction page 2</Paragraph>
        </>,
      ],
    backButtonLabel: 'Back',
    nextButtonLabel: 'Next',
    // Replaces the next button label for the very last instruction page
    startExperimentButtonLabel: 'Start',
  },

  [Page.LOADING_TRIALS]: {
    text: 'Loading Trials...',
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
    bonusSuccessMessage: 'Board succesfully cleared!',
    bonusFailureMessage: 'No more moves left!',

    // Button below the board after the board has no more moves.
    nextBonusRoundButtonLabel: 'Next Bonus Round',
    lastBonusRoundButtonLabel: 'Next Rule (Bonus Completed)',

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
      <>
        <Text size="inherit" weight="bold">
          Board&nbsp;
        </Text>
        <Text size="2em" weight="bold">
          {boardNum} of {numBoardsLeft}
        </Text>
      </>
    ),

    guessButtonLabel: 'Guess the rule',
    guessRulePrompt: 'What is the rule?',
    confidenceScalePrompt: 'How sure are you?',
    leastConfidentLabel: 'Just guessing',
    greatestConfidentLabel: 'Completely sure',

    // Reuse label shown on hovering over the button.
    reusePreviousResponseLabel: 'Fill with previous response',
  },

  [Page.DEMOGRAPHICS_INSTRUCTIONS]: {
    text: "Thank you! We'll now ask a few questions, and you'll be done!",
  },

  [Page.DEBRIEFING]: {
    text: (completionCode: string) => (
      <>
        <Heading>Thank you for participating!</Heading>
        <Paragraph fill>
          Your completion code is <Text weight="bold">{completionCode}</Text>. Please paste the code
          into the mTurk Box.
        </Paragraph>
        <Paragraph fill>The purpose of this HIT is to... TODO Placeholder</Paragraph>
        <Paragraph fill>You may now close this window.</Paragraph>
      </>
    ),
  },

  // Large prompt displayed when browser is not in fullscreen
  fullscreenPrompt: 'Fullscreen is required',
  fullscreenButtonLabel: 'Enter fullscreen',
};
