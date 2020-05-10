import React, { useState } from 'react';
import { Box, CheckBox, Heading, Paragraph, Text } from 'grommet';
import { useDispatch, useSelector } from 'react-redux';
import { Dispatch } from 'redux';
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

const EntrancePage = () => {
  const dispatch: Dispatch<RootAction> = useDispatch();
  const [showEditGames, setShowEditGames] = useState(EDIT_GAMES_ENABLED && true);
  const games = useSelector(gamesSelector);

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
        </Box>
      </Box>
      {EDIT_GAMES_ENABLED && (
        <>
          <CheckBox
            checked={showEditGames}
            label="Edit Games"
            onChange={(event) => setShowEditGames(event.target.checked)}
          />
          <GamesFilesButtons />
        </>
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
