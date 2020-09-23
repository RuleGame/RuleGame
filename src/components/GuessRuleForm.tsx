import React, { useRef, useState } from 'react';
import { Box, Button, Drop, Form, FormField, Grid, Heading, Text } from 'grommet';
import { useDispatch, useSelector } from 'react-redux';
import range from 'lodash/range';
import { Next, Save } from 'grommet-icons';
import TextareaAutosize from 'react-textarea-autosize';
import keycode from 'keycode';
import { useLocalStorage } from 'react-use';
import { guess } from '../store/actions/board';
import { LOCAL_STORAGE_KEY } from '../constants';
import { seriesNoSelector } from '../store/selectors/board';

const TEXT_INPUT_ID = 'guess-input';
const scaleSize = 7;
enum GridArea {
  PROMPT = 'PROMPT',
  LEAST = 'LEAST',
  SCALE = 'SCALE',
  GREATEST = 'GREATEST',
}
const RATING_NUM_ATTRIBUTE_VALUE = 'rating-num';
const CUSTOM_VALIDITY = 'Please type in what you think the rule is';

const GuessRuleForm: React.FunctionComponent = () => {
  const dispatch = useDispatch();
  const seriesNo = useSelector(seriesNoSelector);
  const [savedSeriesNo, setSavedSeriesNo] = useLocalStorage(LOCAL_STORAGE_KEY.SERIES_NO, seriesNo);
  const [savedRuleGuess, setSavedRuleGuess] = useLocalStorage<string | undefined>(
    LOCAL_STORAGE_KEY.GUESS,
    undefined,
  );
  const [ruleGuess, setRuleGuess] = useState('');
  const [guessOpened, setGuessOpened] = useState(false);
  const [showScale, setShowScale] = useState(false);
  const nextButtonRef = useRef<HTMLButtonElement | null>(null);
  const autofillButtonRef = useRef<HTMLButtonElement | null>(null);
  const [autofillButtonOver, setAutofillButtonOver] = useState(false);

  const isPrevSeriesRuleGuessSaved = seriesNo === savedSeriesNo && savedRuleGuess !== undefined;
  const isRuleGuessEmpty = ruleGuess.trim().length === 0;

  return guessOpened ? (
    <>
      <Form onSubmit={() => setShowScale(true)}>
        <Box fill>
          <Box align="start" direction="row" justify="center" height={{ min: 'unset' }}>
            <Heading level="3" margin="none" style={{ width: '100%' }}>
              <Box direction="row" gap="medium" align="baseline">
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
                    translate={undefined}
                    id={TEXT_INPUT_ID}
                    // required
                    value={ruleGuess}
                    onChange={({ target }) => {
                      if ((target.value.trim().length ?? NaN) > 0) {
                        target.setCustomValidity(CUSTOM_VALIDITY);
                      }
                      setRuleGuess(target.value);
                    }}
                    style={{
                      width: '100%',
                      fontFamily: 'inherit',
                      fontSize: 'inherit',
                      border: '0.3em dashed gray',
                    }}
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.keyCode === keycode.codes.enter) {
                        // Don't allow entering new lines even after scale appears using enter key
                        e.preventDefault();
                        if (nextButtonRef.current !== null) {
                          nextButtonRef.current.click();
                        }
                      }
                    }}
                    ref={(el) => {
                      if (el !== null) {
                        if (el.value.trim().length > 0) {
                          el.setCustomValidity('');
                        } else {
                          el.setCustomValidity(CUSTOM_VALIDITY);
                        }
                      }
                    }}
                    name="rule-description"
                    placeholder={
                      isPrevSeriesRuleGuessSaved && autofillButtonOver ? savedRuleGuess : ''
                    }
                  />
                </FormField>
                <Button
                  size="small"
                  icon={<Save size="small" />}
                  primary
                  disabled={!isPrevSeriesRuleGuessSaved}
                  // Disabled condition asserts savedRuleGuess is non-undefined
                  onClick={() => setRuleGuess(savedRuleGuess!)}
                  ref={autofillButtonRef}
                  // Asserting isPrevSeriesRuleGuessSaved prevents unnecessarily opening the drop
                  // between disabling and enabling this button
                  onMouseOver={() => isPrevSeriesRuleGuessSaved && setAutofillButtonOver(true)}
                  onMouseLeave={() => isPrevSeriesRuleGuessSaved && setAutofillButtonOver(false)}
                  onFocus={() => isPrevSeriesRuleGuessSaved && setAutofillButtonOver(true)}
                  onBlur={() => isPrevSeriesRuleGuessSaved && setAutofillButtonOver(false)}
                />
              </Box>
            </Heading>
          </Box>
          {!showScale && (
            <Button icon={<Next />} type="submit" label="Next" ref={nextButtonRef} margin="small" />
          )}
        </Box>
      </Form>
      {showScale && (
        <Grid
          align="center"
          columns={['auto', 'min-content', 'auto']}
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
          fill
        >
          <Box align="center" gridArea={GridArea.PROMPT}>
            <Text color={isRuleGuessEmpty ? 'gray' : 'black'}>
              <Heading level="2">How sure are you?</Heading>
            </Text>
          </Box>
          <Box fill="vertical" gridArea={GridArea.LEAST} align="end">
            <Box width="min-content">
              <Text textAlign="end" color={isRuleGuessEmpty ? 'gray' : 'black'}>
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
              <Box justify="center" align="center" key={ratingNum}>
                <Button
                  disabled={isRuleGuessEmpty}
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
                  onClick={() => {
                    setSavedRuleGuess(ruleGuess);
                    setSavedSeriesNo(seriesNo);
                    dispatch(guess(`${ratingNum}: ${ruleGuess}`));
                  }}
                />
              </Box>
            ))}
          </Box>
          <Box fill="vertical" width="min-content" gridArea={GridArea.GREATEST}>
            <Box width="min-content">
              <Text textAlign="start" color={isRuleGuessEmpty ? 'gray' : 'black'}>
                <Heading level="3" margin="none">
                  Completely sure
                </Heading>
              </Text>
            </Box>
          </Box>
        </Grid>
      )}
      {autofillButtonOver && autofillButtonRef.current !== null && isPrevSeriesRuleGuessSaved && (
        <Drop
          align={{ bottom: 'top' }}
          target={autofillButtonRef.current}
          plain
          // trapFocus set to false allows tabbing through
          trapFocus={false}
        >
          <Box pad="small" background="gray">
            <Text color="white">Autofill previous rule description</Text>
          </Box>
        </Drop>
      )}
    </>
  ) : (
    // FireFox needs height={{ min: 'unset' }} inside a grid
    <Box width="20em" fill height={{ min: 'unset' }} align="center" margin="small">
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
