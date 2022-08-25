import React from 'react';
import { Box, Heading, Image, Paragraph, Text } from 'grommet';
import { Page } from './Page';

import I1_1 from '../assets/instructions_NOBINS/instructions_final.001.jpeg';
import I1_2 from '../assets/instructions_NOBINS/instructions_final.002.jpeg';
import I1_3 from '../assets/instructions_NOBINS/instructions_final.003.jpeg';
import I1_4 from '../assets/instructions_NOBINS/instructions_final.004M.jpeg';
import I1_5 from '../assets/instructions_NOBINS/instructions_final.005.jpeg';
import I1_6 from '../assets/instructions_NOBINS/instructions_final.006.jpeg';
import I1_7 from '../assets/instructions_NOBINS/instructions_final.007M.jpeg';
import I1_8 from '../assets/instructions_NOBINS/instructions_final.008.jpeg';
import I1_9 from '../assets/instructions_NOBINS/instructions_final.009.jpeg';
import I1_10 from '../assets/instructions_NOBINS/instructions_final.010.jpeg';
import I1_11 from '../assets/instructions_NOBINS/instructions_final.011.jpeg';
import I1_12 from '../assets/instructions_NOBINS/instructions_final.012.jpeg';
import I1_13 from '../assets/instructions_NOBINS/instructions_final.013.jpeg';
import I1_14 from '../assets/instructions_NOBINS/instructions_final.014.jpeg';
import I1_15 from '../assets/instructions_NOBINS/instructions_final.015.jpeg';
import I1_16 from '../assets/instructions_NOBINS/instructions_final.016.jpeg';

import I2_1 from '../assets/stalemate_instructions/1.png';
import I2_2 from '../assets/stalemate_instructions/2.png';
import I2_3 from '../assets/stalemate_instructions/3.png';
import I2_4 from '../assets/stalemate_instructions/4.png';
import I2_5 from '../assets/stalemate_instructions/5.png';
import I2_6 from '../assets/stalemate_instructions/6.png';
import I2_7 from '../assets/stalemate_instructions/7.png';
import I2_8 from '../assets/stalemate_instructions/8.png';
import I2_9 from '../assets/stalemate_instructions/9.png';
import I2_10 from '../assets/stalemate_instructions/10.png';
import I2_11 from '../assets/stalemate_instructions/11.png';
import I2_12 from '../assets/stalemate_instructions/12.png';
import I2_13 from '../assets/stalemate_instructions/13.png';

import R1 from '../assets/instructions_relational/1.png';
import R2 from '../assets/instructions_relational/2.png';
import R3 from '../assets/instructions_relational/3.png';
import R4 from '../assets/instructions_relational/4.png';
import R5 from '../assets/instructions_relational/5.png';
import R6 from '../assets/instructions_relational/6.png';
import R7 from '../assets/instructions_relational/7.png';
import R8 from '../assets/instructions_relational/8.png';

const INSTRUCTIONS_R = [R1, R2, R3, R4, R5, R6, R7, R8].map((src) => (
  <>
    <Heading>RuleGame Challenge</Heading>
    <Box width="xlarge" align="center">
      <Image src={src} width="100%" height="100%" style={{ objectFit: 'contain' }} />
    </Box>
  </>
));

const INSTRUCTIONS_1 = [
  // Page 2
  <>
    <Heading>RuleGame Challenge</Heading>
    <Box width="large" align="center">
      <Image src={I1_1} width="600" />
    </Box>
  </>,

  // Page 3
  <>
    <Heading>RuleGame Challenge</Heading>
    <Box width="large" align="center">
      <Image src={I1_2} width="600" />
    </Box>
  </>,

  // Page 4
  <>
    <Heading>RuleGame Challenge</Heading>
    <Box width="large" align="center">
      <Image src={I1_3} width="600" />
    </Box>
  </>,

  // Page 5
  <>
    <Heading>RuleGame Challenge</Heading>
    <Box width="large" align="center">
      <Image src={I1_4} width="600" />
    </Box>
  </>,

  // Page 6
  <>
    <Heading>RuleGame Challenge</Heading>
    <Box width="large" align="center">
      <Image src={I1_5} width="600" />
    </Box>
  </>,

  // Page 7
  <>
    <Heading>RuleGame Challenge</Heading>
    <Box width="large" align="center">
      <Image src={I1_6} width="600" />
    </Box>
  </>,

  // Page 8
  <>
    <Heading>RuleGame Challenge</Heading>
    <Box width="large" align="center">
      <Image src={I1_7} width="600" />
    </Box>
  </>,

  // Page 9
  <>
    <Heading>RuleGame Challenge</Heading>
    <Box width="large" align="center">
      <Image src={I1_8} width="600" />
    </Box>
  </>,

  // Page 10
  <>
    <Heading>RuleGame Challenge</Heading>
    <Box width="large" align="center">
      <Image src={I1_9} width="600" />
    </Box>
  </>,

  // Page 11
  <>
    <Heading>RuleGame Challenge</Heading>
    <Box width="large" align="center">
      <Image src={I1_10} width="600" />
    </Box>
  </>,

  // Page 12
  <>
    <Heading>RuleGame Challenge</Heading>
    <Box width="large" align="center">
      <Image src={I1_11} width="600" />
    </Box>
  </>,

  // Page 13
  <>
    <Heading>RuleGame Challenge</Heading>
    <Box width="large" align="center">
      <Image src={I1_12} width="600" />
    </Box>
  </>,

  // Page 14
  <>
    <Heading>RuleGame Challenge</Heading>
    <Box width="large" align="center">
      <Image src={I1_13} width="600" />
    </Box>
  </>,

  // Page 15
  <>
    <Heading>RuleGame Challenge</Heading>
    <Box width="large" align="center">
      <Image src={I1_14} width="600" />
    </Box>
  </>,

  // Page 16
  <>
    <Heading>RuleGame Challenge</Heading>
    <Box width="large" align="center">
      <Image src={I1_15} width="600" />
    </Box>
  </>,

  // Page 17
  <>
    <Heading>RuleGame Challenge</Heading>
    <Box width="large" align="center">
      <Image src={I1_16} width="600" />
    </Box>
  </>,
];

const INSTRUCTIONS_2 = [
  <>
    <Heading>RuleGame Challenge</Heading>
    <Box width="large" align="center">
      <Image src={I2_1} width="600" />
    </Box>
  </>,
  <>
    <Heading>RuleGame Challenge</Heading>
    <Box width="large" align="center">
      <Image src={I2_2} width="600" />
    </Box>
  </>,
  <>
    <Heading>RuleGame Challenge</Heading>
    <Box width="large" align="center">
      <Image src={I2_3} width="600" />
    </Box>
  </>,
  <>
    <Heading>RuleGame Challenge</Heading>
    <Box width="large" align="center">
      <Image src={I2_4} width="600" />
    </Box>
  </>,
  <>
    <Heading>RuleGame Challenge</Heading>
    <Box width="large" align="center">
      <Image src={I2_5} width="600" />
    </Box>
  </>,
  <>
    <Heading>RuleGame Challenge</Heading>
    <Box width="large" align="center">
      <Image src={I2_6} width="600" />
    </Box>
  </>,
  <>
    <Heading>RuleGame Challenge</Heading>
    <Box width="large" align="center">
      <Image src={I2_7} width="600" />
    </Box>
  </>,
  <>
    <Heading>RuleGame Challenge</Heading>
    <Box width="large" align="center">
      <Image src={I2_8} width="600" />
    </Box>
  </>,
  <>
    <Heading>RuleGame Challenge</Heading>
    <Box width="large" align="center">
      <Image src={I2_9} width="600" />
    </Box>
  </>,
  <>
    <Heading>RuleGame Challenge</Heading>
    <Box width="large" align="center">
      <Image src={I2_10} width="600" />
    </Box>
  </>,
  <>
    <Heading>RuleGame Challenge</Heading>
    <Box width="large" align="center">
      <Image src={I2_11} width="600" />
    </Box>
  </>,
  <>
    <Heading>RuleGame Challenge</Heading>
    <Box width="large" align="center">
      <Image src={I2_12} width="600" />
    </Box>
  </>,
  <>
    <Heading>RuleGame Challenge</Heading>
    <Box width="large" align="center">
      <Image src={I2_13} width="600" />
    </Box>
  </>,
];

export default {
  [Page.CONSENT]: {
    text: (
      <>
        <Paragraph fill>
          {`The task you are about to do is sponsored by `}
          <strong>University of Wisconsin-Madison</strong>
          {`. It is part of a protocol titled “Human and Machine Learning: The Search for Anomalies”.

            The purpose of this work is to compare reasoning biases in human and machine learners
            by testing what reasoning problems are relatively easier or more difficult for people, and
            for machines. `}
          <strong>
            More detailed instructions for this specific task will be provided on the next screen.{' '}
          </strong>
        </Paragraph>
        <Paragraph fill>
          {`This task has no direct benefits. We do not anticipate any psychosocial risks. There is a
            risk of a confidentiality breach. Participants may become fatigued or frustrated due to
            the length of the study. The responses you submit as part of this task will be stored on a
            secure server and accessible only to researchers who have been approved by UW-Madison.
            Processed data with all identifiers removed could be used for future research studies or
            distributed to another investigator for future research studies without additional informed
            consent from the subject or the legally authorized representative.

            You are free to decline to participate, to end participation at any time for any reason, or
            to refuse to answer any individual question without penalty or loss of earned compensation.
            We will not retain data from partial responses. If you would like to withdraw your data after
            participating, you may send an email `}
          <a href="mailto:lupyan@wisc.edu">lupyan@wisc.edu</a>
          {` or complete `}
          <a href="http://tinyurl.com/withdrawdata-lupyanlab"> this form </a>
          {`which will allow you to make a request anonymously.

            If you have any questions or concerns about this task please contact the principal investigator:
            Prof. Vicki Bier at `}
          <a href="mailto:vicki.bier@wisc.edu">vicki.bier@wisc.edu</a>
          {`.
            If you are not satisfied with response of the research team, have more questions, or want to talk
            with someone about your rights as a research participant, you should contact University of Wisconsin’s
            Education Research and Social & Behavioral Science IRB Office at 608-263-2320.`}
        </Paragraph>
      </>
    ),
    checkBoxLabel: 'By clicking this box, I consent to participate in this task.',
    nextButtonLabel: 'Start Experiment',
  },

  [Page.INTRODUCTION]: {
    text: (init?: number) =>
      // A list of JSX (HTML). One per instruction page.
      // Players can navigate through them via back and next buttons.
      [
        ...(init === 3 ? INSTRUCTIONS_R : init === 2 ? INSTRUCTIONS_2 : INSTRUCTIONS_1),
        // Page 18
        <>
          <Heading>RuleGame Challenge</Heading>
          <Paragraph fill>
            {`Please try your best when entering your guesses. We may reject your work if you make uninformative responses.`}
          </Paragraph>
        </>,
      ],
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
      <>
        <Text size="inherit" weight="bold">
          Board&nbsp;
        </Text>
        <Text size="1.25em" weight="bold">
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
        <Paragraph fill>
          Your completion code is <Text weight="bold">{completionCode}</Text>. Please paste the code
          into the mTurk Box.
        </Paragraph>
        <Paragraph fill>
          We’re using this task to better understand what kinds of rules are easy and hard for
          people compared to machine learning algorithms.
        </Paragraph>
        <Paragraph fill>You may now close this window.</Paragraph>
      </>
    ),
  },

  // Large prompt displayed when browser is not in fullscreen
  fullscreenPrompt: 'Fullscreen is required',
  fullscreenButtonLabel: 'Enter fullscreen',
};
