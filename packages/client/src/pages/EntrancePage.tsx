import React, { useEffect, useMemo, useState } from 'react';
import {
  Box,
  Button,
  CheckBox,
  Form,
  FormField,
  Heading,
  Paragraph,
  Text,
  TextInput,
} from 'grommet';
import { useDispatch, useSelector } from 'react-redux';
import { Dispatch } from 'redux';
import { FormCheckmark, FormClose, FormEdit } from 'grommet-icons';
import { saveAs } from 'file-saver';
import { useQuery } from 'react-query';
import { RootAction } from '../store/actions';
import { gamesSelector } from '../store/selectors';
import { removeGame } from '../store/actions/games';
import { addLayer, removeLayer } from '../store/actions/layers';
import GameSelects from '../components/GameSelects';
import AddGameForm from '../components/AddGameForm';
import GamesFilesButtons from '../components/GameFilesButtons';
import AddRuleArrayForm from '../components/AddRuleArrayForm';
import AddBoardObjectsForm from '../components/AddBoardObjectsArrayForm';
import { EDIT_GAMES_ENABLED } from '../constants/env';
import { historySelector, playerNameSelector } from '../store/selectors/history';
import { setPlayerName } from '../store/actions/history';

const EntrancePage = () => {
  const dispatch: Dispatch<RootAction> = useDispatch();
  const [showEditGames, setShowEditGames] = useState(EDIT_GAMES_ENABLED && true);
  const games = useSelector(gamesSelector);
  const playerName = useSelector(playerNameSelector);
  const [playerNameInput, setPlayerNameInput] = useState(playerName);
  const [editPlayerNameEnabled, setEditPlayerNameEnabled] = useState(false);
  useEffect(() => setPlayerNameInput(playerName), [playerName]);
  const history = useSelector(historySelector);
  const { isLoading, error, data } = useQuery('greeting-message', () =>
    fetch('http://sapir.psych.wisc.edu:7133/greeting-message.txt').then((res) => res.text()),
  );

  const greetingMessage = useMemo(() => data?.replace('{num_games}', String(games.length)), [
    games,
    data,
  ]);

  return (
    <Box direction="column" align="center" gap="medium" pad="medium">
      <Box align="center" elevation="large" fill>
        <Box background="brand" fill align="center" pad="medium" justify="center">
          <Heading>RuleGame Challenge</Heading>
          <Paragraph fill>
            {isLoading
              ? 'Loading greeting message...'
              : error
              ? 'Cannot load greeting message'
              : greetingMessage}
          </Paragraph>
        </Box>
        <Box pad="medium">
          {playerName !== undefined ? (
            <>
              <Form
                onSubmit={() => {
                  dispatch(setPlayerName(playerNameInput));
                  setEditPlayerNameEnabled(false);
                }}
              >
                <Box direction="row">
                  {editPlayerNameEnabled ? (
                    <>
                      <Button type="submit" icon={<FormCheckmark />} />
                      <Button
                        icon={<FormClose />}
                        onClick={() => {
                          setPlayerNameInput(playerName);
                          setEditPlayerNameEnabled(false);
                        }}
                      />
                    </>
                  ) : (
                    <Button
                      icon={<FormEdit />}
                      onClick={() => {
                        setEditPlayerNameEnabled(true);
                      }}
                    />
                  )}
                  <FormField>
                    <TextInput
                      onChange={(e) => setPlayerNameInput(e.target.value)}
                      value={playerNameInput}
                      placeholder="Name"
                      required
                      disabled={!editPlayerNameEnabled}
                    />
                  </FormField>
                </Box>
              </Form>
              <Box pad="small" fill align="center" justify="center">
                <Button
                  label="Export Full History"
                  onClick={() => {
                    const blob = new Blob([JSON.stringify(history)], {
                      type: 'text/plain;charset=utf-8',
                    });
                    saveAs(blob, `full-history-${Date.now()}.json`);
                  }}
                />
                <Heading>Enter a Game</Heading>
                {games.length > 0 ? (
                  <GameSelects
                    showEditButtons={showEditGames}
                    onDeleteAll={() =>
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
                      )
                    }
                    games={games}
                  />
                ) : (
                  <Text>(Empty... Add a Game Below)</Text>
                )}
              </Box>
            </>
          ) : (
            <Form onSubmit={() => dispatch(setPlayerName(playerNameInput))}>
              <FormField label="Enter Your Name Here">
                <TextInput
                  onChange={(e) => setPlayerNameInput(e.target.value)}
                  value={playerNameInput}
                  placeholder="Name"
                  required
                />
              </FormField>
              <Button type="submit" label="Enter" />
            </Form>
          )}
        </Box>
      </Box>
      {EDIT_GAMES_ENABLED && (
        <Box gap="medium" align="center">
          <CheckBox
            checked={showEditGames}
            label="Edit Games"
            onChange={(event) => setShowEditGames(event.target.checked)}
          />
          <GamesFilesButtons />
        </Box>
      )}
      {showEditGames && (
        <Box direction="row" gap="medium" align="stretch">
          <AddGameForm />
          <AddRuleArrayForm />
          <AddBoardObjectsForm />
        </Box>
      )}
    </Box>
  );
};

export default EntrancePage;
