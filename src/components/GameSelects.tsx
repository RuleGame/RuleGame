import React from 'react';
import { Box, Button } from 'grommet';
import { Trash } from 'grommet-icons';
import GameSelect from './GameSelect';
import { Game } from '../@types';

const GameSelects: React.FunctionComponent<{
  showEditButtons: boolean;
  onDeleteAll: () => void;
  games: Game[];
}> = ({ showEditButtons, games, onDeleteAll }) => {
  return (
    <Box align="center" gap="medium">
      {games.map((game) => (
        <GameSelect key={game.id} game={game} showEditButtons={showEditButtons} />
      ))}
      {showEditButtons && <Button icon={<Trash />} label="Delete All" onClick={onDeleteAll} />}
    </Box>
  );
};

export default GameSelects;
