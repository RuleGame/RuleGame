import React, { useState } from 'react';
import { Box, Button, FormField, Grid, Heading, Text, TextInput } from 'grommet';
import { useDispatch } from 'react-redux';
import range from 'lodash/range';
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

  // Form type should accept generics for submit element and onChange parameter
  return (
    <Box>
      <Box align="center" direction="row" flex="shrink">
        <FormField
          label={
            <Text size="xxlarge" weight="bold">
              What is the rule?
            </Text>
          }
          htmlFor={TEXT_INPUT_ID}
          component={Box}
          style={{ flexDirection: 'row', width: '100%', height: '100%' }}
          contentProps={{
            flex: 'grow',
            border: { side: 'all', style: 'dashed', size: '0.3em', color: 'gray' },
          }}
        >
          <TextInput
            id={TEXT_INPUT_ID}
            required
            name="body"
            value={ruleGuess}
            onChange={({ target: { value } }) => setRuleGuess(value)}
          />
        </FormField>
      </Box>
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
          <Heading>How sure are you?</Heading>
        </Box>
        <Box fill="vertical" gridArea={GridArea.LEAST} align="end">
          <Box width="min-content">
            <Text size="large" weight="bold" textAlign="end">
              Just guessing
            </Text>
          </Box>
        </Box>
        <Box direction="row" gap="small" gridArea={GridArea.SCALE} justify="center">
          {range(1, scaleSize + 1).map((ratingNum) => (
            <Button
              disabled={ruleGuess.trim().length === 0}
              key={ratingNum}
              rating-num={RATING_NUM_ATTRIBUTE_VALUE}
              label={
                <Box align="center">
                  <Text size="large" weight="bold">
                    {ratingNum}
                  </Text>
                </Box>
              }
              color="black"
              size="medium"
              style={{
                borderRadius: '50%',
                padding: 'none',
                width: '3em',
                height: '3em',
                borderWidth: '0.25em',
              }}
              onClick={() => dispatch(guess(`${ratingNum}: ${ruleGuess}`))}
            />
          ))}
        </Box>
        <Box fill="vertical" width="min-content" gridArea={GridArea.GREATEST}>
          <Box width="min-content">
            <Text size="large" weight="bold" textAlign="start">
              Completely sure
            </Text>
          </Box>
        </Box>
      </Grid>
    </Box>
  );
};

export default GuessRuleForm;
