import React from 'react';
import { Box, Heading, Image, Paragraph, Text } from 'grommet';
import { Page } from './Page';
import I1 from '../assets/instructions/instructions_final.001.jpeg';
import I2 from '../assets/instructions/instructions_final.002.jpeg';
import I3 from '../assets/instructions/instructions_final.003.jpeg';
import I4 from '../assets/instructions/instructions_final.004.jpeg';
import I5 from '../assets/instructions/instructions_final.005.jpeg';
import I6 from '../assets/instructions/instructions_final.006.jpeg';
import I7 from '../assets/instructions/instructions_final.007.jpeg';
import I8 from '../assets/instructions/instructions_final.008.jpeg';
import I9 from '../assets/instructions/instructions_final.009.jpeg';
import I10 from '../assets/instructions/instructions_final.010.jpeg';
import I11 from '../assets/instructions/instructions_final.011.jpeg';
import I12 from '../assets/instructions/instructions_final.012.jpeg';
import I13 from '../assets/instructions/instructions_final.013.jpeg';
import I14 from '../assets/instructions/instructions_final.014.jpeg';
import I15 from '../assets/instructions/instructions_final.015.jpeg';
import I16 from '../assets/instructions/instructions_final.016.jpeg';
import I17 from '../assets/instructions/instructions_final.017.jpeg';

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
          <strong>More detailed instructions for this specific task will be provided on the next screen. </strong>
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
          <a href="mailto:http://tinyurl.com/withdrawdata-lupyanlab"> this form </a> 
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
          <Box width="large">
            <Image src={I1} fill />
          </Box>
          
        </>,

        // Page 3
        <>
          <Box width="large">
            <Image src={I2} fill />
          </Box>
          
        </>,

        // Page 4
        <>
          <Box width="large">
            <Image src={I3} fill />
          </Box>
          
        </>,

        // Page 5
        <>
          <Box width="large">
            <Image src={I4} fill />
          </Box>
          
        </>,

        // Page 6
        <>
          <Box width="large">
            <Image src={I5} fill />
          </Box>
          
        </>,

        // Page 7
        <>
          <Box width="large">
            <Image src={I6} fill />
          </Box>
          
        </>,

        // Page 8
        <>
          <Box width="large">
            <Image src={I7} fill />
          </Box>
          
        </>,

        // Page 9
        <>
          <Box width="large">
            <Image src={I8} fill />
          </Box>
          
        </>,

        // Page 10
        <>
          <Box width="large">
            <Image src={I9} fill />
          </Box>
          
        </>,

        // Page 11
        <>
          <Box width="large">
            <Image src={I10} fill />
          </Box>
          
        </>,

        // Page 12
        <>
          <Box width="large">
            <Image src={I11} fill />
          </Box>
          
        </>,

        // Page 13
        <>
          <Box width="large">
            <Image src={I12} fill />
          </Box>
          
        </>,

        // Page 14
        <>
          <Box width="large">
            <Image src={I13} fill />
          </Box>
          
        </>,

        // Page 15
        <>
          <Box width="large">
            <Image src={I14} fill />
          </Box>
          
        </>,

        // Page 16
        <>
          <Box width="large">
            <Image src={I15} fill />
          </Box>
          
        </>,

        // Page 17
        <>
          <Box width="large">
            <Image src={I16} fill />
          </Box>
          
        </>,

        // Page 18
        <>
          <Box width="large">
            <Image src={I17} fill />
          </Box>
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
