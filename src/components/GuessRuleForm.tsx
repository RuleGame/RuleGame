import React, { useRef, useState } from 'react';
import { Box, Button, Form, FormField, Grid, Heading, Text } from 'grommet';
import { useDispatch } from 'react-redux';
import range from 'lodash/range';
import { Next } from 'grommet-icons';
import TextareaAutosize from 'react-textarea-autosize';
import keycode from 'keycode';
import { guess } from '../store/actions/board';

const TEXT_INPUT_ID = 'guess-input';
const scaleSize = 7;
enum GridArea {
  PROMPT = 'PROMPT',
  LEAST = 'LEAST',
  SCALE = 'SCALE',
  GREATEST = 'GREATEST',
}
const RATING_NUM_ATTRIBUTE_VALUE = 'rating-num';

const GuessRuleForm: React.FunctionComponent = () => {
  const dispatch = useDispatch();
  const [ruleGuess, setRuleGuess] = useState('');
  const [guessOpened, setGuessOpened] = useState(false);
  const [showScale, setShowScale] = useState(false);
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  // Form type should accept generics for submit element and onChange parameter
  // FireFox needs height={{ min: 'unset' }} inside a grid
  return guessOpened ? (
    <Box height={{ min: 'unset' }}>
      <Form onSubmit={() => setShowScale(true)}>
        <Box fill>
          <Box align="start" direction="row" justify="center" height={{ min: 'unset' }}>
            <Heading level="3" margin="none" style={{ width: '100%' }}>
              <FormField
                label={
                  <Heading level="3" margin="none">
                    What is the rule?
                  </Heading>
                }
                htmlFor={TEXT_INPUT_ID}
                component={Box}
                style={{
                  flexDirection: 'row',
                  width: '100%',
                  height: '100%',
                  justifyContent: 'center',
                }}
                contentProps={{
                  flex: 'grow',
                  border: 'top',
                }}
              >
                {/* translate should be an optional prop in the type def */}
                <TextareaAutosize
                  translate
                  id={TEXT_INPUT_ID}
                  required
                  value={ruleGuess}
                  onChange={({ target: { value } }) => setRuleGuess(value)}
                  style={{
                    width: '100%',
                    fontFamily: 'inherit',
                    fontSize: 'inherit',
                    border: '0.3em dashed gray',
                  }}
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.keyCode === keycode.codes.enter && buttonRef.current !== null) {
                      buttonRef.current.click();
                      e.preventDefault();
                    }
                  }}
                  ref={(el) => {
                    if (el !== null) {
                      el.setCustomValidity('Please type in what you think the rule is');
                    }
                  }}
                />
              </FormField>
            </Heading>
          </Box>
          {!showScale && <Button icon={<Next />} type="submit" label="Next" ref={buttonRef} />}
        </Box>
      </Form>
      {showScale && (
        <Grid
          align="center"
          columns={['auto', 'auto', 'auto']}
          rows={['auto', 'auto']}
          areas={[
            { name: GridArea.PROMPT, start: [1, 0], end: [1, 0] },
            {
              name: GridArea.LEAST,
              start: [0, 1],
              end: [0, 1],
            },
            {
              name: GridArea.SCALE,
              start: [1, 1],
              end: [1, 1],
            },
            {
              name: GridArea.GREATEST,
              start: [2, 1],
              end: [2, 1],
            },
          ]}
        >
          <Box align="center" gridArea={GridArea.PROMPT}>
            <Heading level="2">How sure are you?</Heading>
          </Box>
          <Box fill="vertical" gridArea={GridArea.LEAST} align="end">
            <Box width="min-content">
              <Text textAlign="end">
                <Heading level="3" margin="none">
                  Just guessing
                </Heading>
              </Text>
            </Box>
          </Box>
          <Box
            direction="row"
            gap="xsmall"
            gridArea={GridArea.SCALE}
            justify="center"
            pad={{ left: 'small', right: 'small' }}
          >
            {range(1, scaleSize + 1).map((ratingNum) => (
              <Box justify="center" align="center">
                <Button
                  disabled={ruleGuess.trim().length === 0}
                  key={ratingNum}
                  rating-num={RATING_NUM_ATTRIBUTE_VALUE}
                  label={
                    <Box align="center" justify="center">
                      <Heading level="3" margin="none">
                        {ratingNum}
                      </Heading>
                    </Box>
                  }
                  color="black"
                  style={{
                    borderRadius: '50%',
                    padding: 'unset',
                    width: '3em',
                    height: '3em',
                    borderWidth: '0.25em',
                  }}
                  onClick={() => dispatch(guess(`${ratingNum}: ${ruleGuess}`))}
                />
              </Box>
            ))}
          </Box>
          <Box fill="vertical" width="min-content" gridArea={GridArea.GREATEST}>
            <Box width="min-content">
              <Text textAlign="start">
                <Heading level="3" margin="none">
                  Completely sure
                </Heading>
              </Text>
            </Box>
          </Box>
        </Grid>
      )}
    </Box>
  ) : (
    // FireFox needs height={{ min: 'unset' }} inside a grid
    <Box width="20em" fill height={{ min: 'unset' }}>
      <Button
        size="large"
        label={
          <Text weight="bold" size="xxlarge" color="white">
            Guess the rule
          </Text>
        }
        onClick={() => setGuessOpened(true)}
        primary
        color="deepskyblue"
      />
    </Box>
  );
};

export default GuessRuleForm;
