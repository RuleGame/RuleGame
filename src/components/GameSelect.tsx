import React, { useCallback } from 'react';
import { Box, Button } from 'grommet';
import { Close, View } from 'grommet-icons';
import { Dispatch } from 'redux';
import { useDispatch, useSelector } from 'react-redux';
import { Game } from '../@types';
import { RootAction } from '../store/actions';
import { boardObjectsArraysByIdSelector, ruleArraysByIdSelector } from '../store/selectors';
import { addLayer, removeLayer } from '../store/actions/layers';
import { enterGame, removeGame } from '../store/actions/games';
import { RootState } from '../store/reducers';

const GameSelect: React.FunctionComponent<{
  showEditButtons: boolean;
  game: Game;
}> = ({ showEditButtons, game }) => {
  const dispatch: Dispatch<RootAction> = useDispatch();
  const ruleArray = useSelector<RootState, string>(
    (state) => ruleArraysByIdSelector(state)[game.ruleArray].stringified,
  );
  const boardObjectsArray = useSelector<RootState, string>(
    (state) => boardObjectsArraysByIdSelector(state)[game.boardObjectsArray].stringified,
  );

  const handlePreview = useCallback(
    () =>
      dispatch(
        addLayer(
          `${game.name} Game Preview:`,
          `Rule Array:\n${ruleArray}\n\nBoard Objects:\n${boardObjectsArray}`,
          [
            {
              key: 'close',
              label: 'Close',
              action: removeLayer('game-preview'),
            },
          ],
          'game-preview',
        ),
      ),
    [boardObjectsArray, dispatch, game.name, ruleArray],
  );
  const handleDelete = useCallback(
    () =>
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
      ),
    [dispatch, game.id, game.name],
  );

  return (
    <Box direction="row" key={game.id} gap="small">
      {showEditButtons && <Button icon={<View />} onClick={handlePreview} />}
      <Button
        onClick={useCallback(() => dispatch(enterGame(game.id)), [dispatch, game.id])}
        label={game.name}
      />
      {showEditButtons && <Button onClick={handleDelete} icon={<Close />} />}
    </Box>
  );
};

export default GameSelect;
