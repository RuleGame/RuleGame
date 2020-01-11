import React, { useCallback, useState } from 'react';
import { Box, Button, Form, FormField, Heading, TextArea } from 'grommet';
import { useDispatch, useSelector } from 'react-redux';
import { Dispatch } from 'redux';
import { Close } from 'grommet-icons';
import { RootAction } from '../store/actions';
import { gamesSelector } from '../store/selectors';
import { addGame, enterGame, removeGame } from '../store/actions/games';

const EntrancePage = () => {
  const dispatch: Dispatch<RootAction> = useDispatch();
  const [enteredAtomArray, setEnteredAtomArray] = useState('');
  const [boardObjects, setBoardObjects] = useState('');
  const [gameName, setGameName] = useState('');
  const games = useSelector(gamesSelector);

  return (
    <Box direction="column" align="center" gap="medium" pad="medium">
      <Box align="center" pad="xlarge" elevation="large">
        <Heading>Enter Game</Heading>
        <Box pad="small">
          {games.map((game) => (
            <Box direction="row" key={game.id}>
              <Button onClick={() => dispatch(enterGame(game.id))} label={game.name} />
              <Button onClick={() => dispatch(removeGame(game.id))} icon={<Close />} />
            </Box>
          ))}
        </Box>
      </Box>
      <Box elevation="large" align="center" pad="small">
        <Heading level="2">Add New Game</Heading>
        <Form onSubmit={() => dispatch(addGame.request(gameName, enteredAtomArray, boardObjects))}>
          <Box justify="center" gap="medium">
            <Box fill justify="center" align="center">
              <Box width="medium" elevation="medium" pad="small">
                <FormField
                  required
                  label="Game Name"
                  value={gameName}
                  onChange={(event) => setGameName(event.target.value)}
                  placeholder="Name"
                />
              </Box>
            </Box>
            <Box direction="row" gap="medium" pad="medium" justify="evenly" wrap elevation="medium">
              <FormField label="New Board Objects" name="BoardObjects" pad>
                <TextArea
                  required
                  rows={20}
                  cols={50}
                  wrap="off"
                  onChange={useCallback(
                    (e: React.ChangeEvent<HTMLTextAreaElement>) => setBoardObjects(e.target.value),
                    [setBoardObjects],
                  )}
                  value={boardObjects}
                  size="small"
                  placeholder={`Custom Board Objects (JSON format):
Board Object Shape:
{
  "id": string;
  "color": Color;
  "shape": Shape;
  "x": number;
  "y": number;
}

Array Example:
[
  {
    "color": "red",
    "id": "1",
    "shape": "square",
    "x": 1,
    "y": 2
  },
  {
    "color": "blue",
    "id": "2",
    "shape": "circle",
    "x": 2,
    "y": 3
  }
]
`}
                />
              </FormField>
              <FormField label="New Rule Array" name="RuleArray" pad>
                <TextArea
                  required
                  value={enteredAtomArray}
                  onChange={useCallback(
                    (e: React.ChangeEvent<HTMLTextAreaElement>) =>
                      setEnteredAtomArray(e.target.value),
                    [setEnteredAtomArray],
                  )}
                  size="small"
                  rows={20}
                  cols={50}
                  wrap="off"
                  placeholder="(10,square,*,*,[1,2]) (10,*,green,10,[2,3])
(*,*,*,*,[ps,pc])
(*,*,*,*,[(p+1)%4])"
                />
              </FormField>
            </Box>
            <Button primary type="submit" label="Add Game" />
          </Box>
        </Form>
      </Box>
    </Box>
  );
};

export default EntrancePage;
