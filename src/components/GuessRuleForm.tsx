import React, { useState } from 'react';
import { Button, Form, FormField, Heading, TextInput } from 'grommet';
import { useDispatch } from 'react-redux';
import { guess } from '../store/actions/board';

const GuessRuleForm: React.FunctionComponent = () => {
  const dispatch = useDispatch();
  const [ruleGuess, setRuleGuess] = useState('');

  return (
    <Form onSubmit={() => dispatch(guess(ruleGuess))}>
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
