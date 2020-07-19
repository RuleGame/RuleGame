import React, { useState } from 'react';
import { Button, Form, FormField, Heading, TextInput } from 'grommet';
import { RULE_EMAIL_ADDRESS } from '../constants';

const GuessRuleForm: React.FunctionComponent<{ gameId: string; onSubmit?: () => void }> = ({
  gameId,
  onSubmit = () => {},
}) => {
  const [ruleGuess, setRuleGuess] = useState('');

  return (
    <Form
      onSubmit={() => {
        const a = document.createElement('a');
        a.href = `mailto:${RULE_EMAIL_ADDRESS}?subject=Rule Array Guess (GameID: ${gameId})&body=${ruleGuess}`;
        a.click();
        onSubmit();
      }}
    >
      <Heading>Guess Rule</Heading>
      <FormField label="Describe the rule">
        <TextInput
          required
          name="body"
          value={ruleGuess}
          onChange={({ target: { value } }) => setRuleGuess(value)}
        />
      </FormField>
      <Button type="submit" label="Submit" />
    </Form>
  );
};

export default GuessRuleForm;
