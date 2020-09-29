import React from 'react';
import { Box, Button } from 'grommet';
import { useDispatch } from 'react-redux';
import { Dispatch } from 'redux';
import { useQuery } from 'react-query';
import { RootAction } from '../store/actions';
import { nextPage } from '../store/actions/page';
import { api, METHOD } from '../utils/api';
import { useExperimentPlan, useWorkerId } from '../utils/hooks';
import texts from '../constants/texts';
import { Page } from '../constants/Page';

export default () => {
  const dispatch: Dispatch<RootAction> = useDispatch();
  const workerId = useWorkerId();
  const exp = useExperimentPlan();
  const { data, isLoading } = useQuery(`${workerId}-INTRODUCTION`, () =>
    api('/w2020/game-data/GameService2/player', METHOD.POST, { playerId: workerId, exp }, {}),
  );
  const numRules = isLoading ? '...' : data?.data.trialList.length ?? '?';

  return (
    <Box direction="column" align="center" gap="medium" pad="medium">
      <Box align="center" elevation="large" fill>
        <Box background="brand" fill align="center" pad="medium" justify="center">
          {texts[Page.INTRODUCTION].text(numRules)}
          <Button
            label={texts[Page.INTRODUCTION].buttonLabel}
            primary
            onClick={() => dispatch(nextPage())}
          />
        </Box>
      </Box>
    </Box>
  );
};
