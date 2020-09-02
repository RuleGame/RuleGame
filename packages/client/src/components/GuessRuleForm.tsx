import React, { useState } from 'react';
import { Button, Form, FormField, Heading, TextInput } from 'grommet';
import { useSelector } from 'react-redux';
import { playerNameSelector } from '../store/selectors/history';
import { api, METHOD } from '../utils/api';

const GuessRuleForm: React.FunctionComponent<{ gameId: string; onSubmit?: () => void }> = ({
  gameId,
  onSubmit = () => {},
}) => {
  const [ruleGuess, setRuleGuess] = useState('');
  const playerName = useSelector(playerNameSelector);

  return (
    <Form
      onSubmit={async () => {
        // const formData = new FormData();
        // formData.append('dir', 'guesses');
        // formData.append('file', `${playerName}_${gameId}_${Date.now()}.txt`);
        // formData.append('data', ruleGuess);
        //
        // fetch('http://localhost:7150/w2020/game-data/GameService/writeFile', {
        //   method: 'POST',
        //   body: formData,
        //   headers: {
        //     'Content-Type': 'application/x-www-form-urlencoded',
        //   },
        // });
        await api(
          '/w2020/game-data/GameService/writeFile',
          METHOD.POST,
          {
            dir: 'guesses',
            file: `${playerName}_${gameId}_${Date.now()}.txt`,
            data: ruleGuess,
          },
          {},
        );
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
