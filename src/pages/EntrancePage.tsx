import React, { useCallback, useState } from 'react';
import { Box, Button, CheckBox, Heading, Paragraph, Text } from 'grommet';
import { useDispatch, useSelector } from 'react-redux';
import { Dispatch } from 'redux';
import { saveAs } from 'file-saver';
import { RootAction } from '../store/actions';
import { exportedGamesSelector, gamesSelector } from '../store/selectors';
import { addGame, removeGame } from '../store/actions/games';
import { addLayer, removeLayer } from '../store/actions/layers';
import GameSelects from '../components/GameSelects';
import AddGameForm from '../components/AddGameForm';

const EntrancePage = () => {
  const dispatch: Dispatch<RootAction> = useDispatch();
  const [showEditGames, setShowEditGames] = useState(false);
  const games = useSelector(gamesSelector);
  const exportGamesString = useSelector(exportedGamesSelector);
  const handleDeleteAll = useCallback(
    () =>
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
      ),
    [dispatch, games],
  );

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
              <GameSelects
                showEditButtons={showEditGames}
                onDeleteAll={handleDeleteAll}
                games={games}
              />
            ) : (
              <Text>(Empty... Add a Game Below)</Text>
            )}
          </Box>
        </Box>
      </Box>
      <CheckBox
        checked={showEditGames}
        label="Edit Games"
        onChange={useCallback((event) => setShowEditGames(event.target.checked), [])}
      />
      <Box gap="small">
        <Button
          label="Import Games"
          onClick={useCallback(() => {
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
          }, [dispatch])}
        />
        <Button
          label="Export Games"
          onClick={useCallback(() => {
            const blob = new Blob([exportGamesString], { type: 'text/plain;charset=utf-8' });
            saveAs(blob, 'exported-games.json');
          }, [exportGamesString])}
        />
      </Box>
      {showEditGames && <AddGameForm />}
    </Box>
  );
};

export default EntrancePage;
