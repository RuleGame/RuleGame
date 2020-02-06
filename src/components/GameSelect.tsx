import React, { useCallback, useMemo } from 'react';
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
  const ruleArray = useSelector<RootState, string | undefined>(
    (state) => game.ruleArray && ruleArraysByIdSelector(state)[game.ruleArray].stringified,
  );
  const boardObjectsArraysById = useSelector(boardObjectsArraysByIdSelector);

  const stringifiedBoardObjectsArrays = useMemo(
    () =>
      game.boardObjectsArrays.reduce((acc, boardObjectsArray) => {
        const b = boardObjectsArraysById[boardObjectsArray];
        return `${acc}\n\n${b.name}: ${b.stringified}`;
      }, ''),
    [boardObjectsArraysById, game.boardObjectsArrays],
  );

  return (
    <Box direction="row" key={game.id} gap="small">
      {showEditButtons && (
        <Button
          icon={<View />}
          onClick={() =>
            dispatch(
              addLayer(
                `${game.name} Game Preview:`,
                `Rule Array:\n${ruleArray}\n\nBoard Objects:\n${stringifiedBoardObjectsArrays}`,
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
      <Button
        onClick={useCallback(() => dispatch(enterGame(game.id)), [dispatch, game.id])}
        label={game.name}
      />
      {showEditButtons && (
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
  );
};

export default GameSelect;
