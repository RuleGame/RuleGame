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
          <Heading>RuleGame Challenge</Heading>
          <Paragraph fill>
            Welcome to the RuleGame challenge. There are {games.length} different rules. Each rule
            describes an allowed way of clearing some colored objects from a game board. To clear an
            object, you must grab it with the mouse, and drag it to the correct bucket. When you
            release it at the correct bucket, the bucket smiles, and the object’s place turns into a
            check mark. If you release it at the wrong bucket, it jumps back onto the board where it
            was. When you hover over an object, the little hand will tell you that it can move.
            After you have cleared an entire display, you can give up, or ask for a new display.
            After you have cleared a few displays without too many errors, you can take a chance to
            guess at the rule. Please be patient after you guess because we require human judges to
            review your guesses.
          </Paragraph>
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
