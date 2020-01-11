import React, { useState } from 'react';
import {
  Box,
  Button,
  CheckBox,
  Form,
  FormField,
  Heading,
  TextArea,
  Text,
  Paragraph,
} from 'grommet';
import { useDispatch, useSelector } from 'react-redux';
import { Dispatch } from 'redux';
import { Close, View, Trash } from 'grommet-icons';
import { saveAs } from 'file-saver';
import { RootAction } from '../store/actions';
import {
  boardObjectsArraysByIdSelector,
  exportedGamesSelector,
  gamesSelector,
  ruleArraysByIdSelector,
} from '../store/selectors';
import { addGame, enterGame, removeGame } from '../store/actions/games';
import { addLayer, removeLayer } from '../store/actions/layers';

const EntrancePage = () => {
  const dispatch: Dispatch<RootAction> = useDispatch();
  const [enteredAtomArray, setEnteredAtomArray] = useState('');
  const [boardObjects, setBoardObjects] = useState('');
  const [gameName, setGameName] = useState('');
  const [showEditGames, setShowEditGames] = useState(false);
  const games = useSelector(gamesSelector);
  const boardObjectsArraysById = useSelector(boardObjectsArraysByIdSelector);
  const ruleArraysById = useSelector(ruleArraysByIdSelector);
  const exportGamesString = useSelector(exportedGamesSelector);

  return (
    <Box direction="column" align="center" gap="medium" pad="medium">
      <Box align="center" elevation="large" fill>
        <Box background="brand" fill align="center" pad="medium" justify="center">
          <Heading>Introduction</Heading>
          <Paragraph>My Rule Game Introduction</Paragraph>
        </Box>
        <Box pad="medium">
          <Heading>Enter a Game</Heading>
          <Box pad="small" fill align="center" justify="center">
            {games.length > 0 ? (
              <Box align="center" gap="small">
                {games.map((game) => (
                  <Box direction="row" key={game.id} gap="small">
                    {showEditGames && (
                      <Button
                        icon={<View />}
                        onClick={() =>
                          dispatch(
                            addLayer(
                              `${game.name} Game Preview:`,
                              `Rule Array:\n${
                                ruleArraysById[game.ruleArray].stringified
                              }\n\nBoard Objects:\n${
                                boardObjectsArraysById[game.boardObjectsArray].stringified
                              }`,
                              [
                                {
                                  key: 'close',
                                  label: 'Close',
                                  action: removeLayer('game-preview'),
                                },
                              ],
                              'game-preview',
                            ),
                          )
                        }
                      />
                    )}
                    <Button onClick={() => dispatch(enterGame(game.id))} label={game.name} />
                    {showEditGames && (
                      <Button
                        onClick={() =>
                          dispatch(
                            addLayer(
                              'Delete Game?',
                              `Are you sure you want to delete ${game.name}?`,
                              [
                                {
                                  key: 'yes',
                                  label: 'Yes',
                                  action: [removeLayer('delete-game'), removeGame(game.id)],
                                },
                                {
                                  key: 'no',
                                  label: 'No',
                                  action: removeLayer('delete-game'),
                                },
                              ],
                              'delete-game',
                            ),
                          )
                        }
                        icon={<Close />}
                      />
                    )}
                  </Box>
                ))}
                {showEditGames && (
                  <Button
                    icon={<Trash />}
                    label="Delete All"
                    onClick={() => {
                      dispatch(
                        addLayer(
                          'Delete All Games?',
                          `Are you sure you want to delete all games?`,
                          [
                            {
                              key: 'yes',
                              label: 'Yes',
                              action: [
                                removeLayer('delete-all-games'),
                                ...games.map((game) => removeGame(game.id)),
                              ],
                            },
                            {
                              key: 'no',
                              label: 'No',
                              action: removeLayer('delete-all-games'),
                            },
                          ],
                          'delete-all-games',
                        ),
                      );
                    }}
                  />
                )}
              </Box>
            ) : (
              <Text>(Empty... Add a Game Below)</Text>
            )}
          </Box>
        </Box>
      </Box>
      <CheckBox
        checked={showEditGames}
        label="Edit Games"
        onChange={(event) => setShowEditGames(event.target.checked)}
      />
      <Box gap="small">
        <Button
          label="Import Games"
          onClick={() => {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = '.json';
            input.onchange = (event: Event) => {
              const file = (event?.target as HTMLInputElement)?.files?.[0];
              if (file) {
                try {
                  const fileReader = new FileReader();
                  fileReader.readAsText(file);
                  fileReader.onload = (event) => {
                    const games: {
                      id: string;
                      name: string;
                      ruleArray: string;
                      boardObjectsArray: string;
                    }[] = JSON.parse(event?.target?.result as string);
                    games.map((game) =>
                      dispatch(
                        addGame.request(game.name, game.ruleArray, game.boardObjectsArray, game.id),
                      ),
                    );
                  };
                } catch (error) {
                  dispatch(
                    addLayer(
                      'Error Parsing File',
                      error.message,
                      [
                        {
                          key: 'close',
                          label: 'Close',
                          action: removeLayer('close-import-error'),
                        },
                      ],
                      'close-import-error',
                    ),
                  );
                }
              }
            };
            input.click();
          }}
        />
        <Button
          label="Export Games"
          onClick={() => {
            const blob = new Blob([exportGamesString], { type: 'text/plain;charset=utf-8' });
            saveAs(blob, 'exported-games.json');
          }}
        />
      </Box>
      {showEditGames && (
        <Box elevation="large" align="center" pad="small">
          <Heading level="2">Add a New Game</Heading>
          <Form
            onSubmit={() => dispatch(addGame.request(gameName, enteredAtomArray, boardObjects))}
          >
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
              <Box
                direction="row"
                gap="medium"
                pad="medium"
                justify="evenly"
                wrap
                elevation="medium"
              >
                <FormField label="New Board Objects" name="BoardObjects" pad>
                  <TextArea
                    required
                    rows={20}
                    cols={50}
                    wrap="off"
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                      setBoardObjects(e.target.value)
                    }
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
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                      setEnteredAtomArray(e.target.value)
                    }
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
      )}
    </Box>
  );
};

export default EntrancePage;
