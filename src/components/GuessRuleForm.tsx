import React, { useState } from 'react';
import { Button, Form, FormField, Heading, TextInput } from 'grommet';

const GuessRuleForm: React.FunctionComponent = () => {
  const [ruleGuess, setRuleGuess] = useState('');

  return (
    <Form
      onSubmit={() => {
        const a = document.createElement('a');
        a.href = `mailto:someone@example.com?subject=Rule Array Guess&body=${ruleGuess}`;
        a.click();
      }}
    >
      <Heading>Guess Rule</Heading>
      <FormField label="Describe the rule">
        <TextInput
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
