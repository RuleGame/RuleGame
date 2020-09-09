import React, { useCallback } from 'react';
import { Box, Button } from 'grommet';
import { Dispatch } from 'redux';
import { useDispatch, useSelector } from 'react-redux';
import { saveAs } from 'file-saver';
import { RootAction } from '../store/actions';
import { loadGames } from '../store/actions/games';
import { exportedGamesSelector } from '../store/selectors';

const GamesFilesButtons: React.FunctionComponent = () => {
  const dispatch: Dispatch<RootAction> = useDispatch();
  const exportGamesString = useSelector(exportedGamesSelector);

  return (
    <Box gap="small">
      <Button
        label="Import Games"
        onClick={useCallback(() => {
          const input = document.createElement('input');
          input.type = 'file';
          input.accept = '.json';
          input.onchange = (event: Event) => {
            const file = (event?.target as HTMLInputElement)?.files?.[0];
            if (file) dispatch(loadGames.request(file));
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
  );
};

export default GamesFilesButtons;
