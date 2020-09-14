import React, { useCallback } from 'react';
import { Box, Button, Heading, Paragraph } from 'grommet';
import { Close, View } from 'grommet-icons';
import { useDispatch, useSelector } from 'react-redux';
import { Dispatch } from 'redux';
import { Game } from '../@types';
import { RootAction } from '../store/actions';
import { enterGame, removeGame } from '../store/actions/games';
import { addLayer, removeLayer } from '../store/actions/layers';
import { RootState } from '../store/reducers';
import BoardPreview from './BoardPreview';
import { ruleArraysByIdSelector } from '../store/selectors/rule-arrays';
import { boardObjectsArraysByIdSelector } from '../store/selectors/board-object-arrays';

const GameSelect: React.FunctionComponent<{
  showEditButtons: boolean;
  game: Game;
}> = ({ showEditButtons, game }) => {
  const dispatch: Dispatch<RootAction> = useDispatch();
  const ruleArray = useSelector<
    RootState,
    undefined | { id: string; name: string; stringified: string; order?: number[] }
  >((state) => (game.ruleArray ? ruleArraysByIdSelector(state)[game.ruleArray] : undefined));
  const boardObjectsArraysById = useSelector(boardObjectsArraysByIdSelector);

  return (
    <Box direction="row" key={game.id} align="center">
      {showEditButtons && (
        <Button
          icon={<View />}
          onClick={() =>
            dispatch(
              addLayer(
                `${game.name} Game Preview:`,
                <Box height={{ min: 'auto' }}>
                  <Heading>Rule Array:</Heading>
                  {ruleArray?.stringified.split('\n').map((line, i) => (
                    // eslint-disable-next-line react/no-array-index-key
                    <Paragraph key={i} margin="none">
                      {line}
                    </Paragraph>
                  ))}
                  {ruleArray?.order && (
                    <Paragraph> Order: JSON.stringify(ruleArray.order)</Paragraph>
                  )}
                  <Heading>Board Objects:</Heading>

                  {game.useRandomBoardObjects
                    ? `Using ${game.numRandomBoardObjects} random board objects...`
                    : game.boardObjectsArrays.map((boardObjectsArray) => (
                        // eslint-disable-next-line react/jsx-indent
                        <BoardPreview
                          key={boardObjectsArray}
                          boardObjects={boardObjectsArraysById[boardObjectsArray].value}
                        />
                      ))}
                </Box>,
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
