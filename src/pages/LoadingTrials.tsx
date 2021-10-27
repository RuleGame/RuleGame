import { Box, Heading } from 'grommet';
import React from 'react';
import { useDispatch } from 'react-redux';
import { useMount, useSearchParam } from 'react-use';
import { Dispatch } from 'redux';
import Spinner from '../components/Spinner';
import { SearchQueryKey } from '../constants';
import { Page } from '../constants/Page';
import texts from '../constants/texts';
import { RootAction } from '../store/actions';
import { startTrials } from '../store/actions/board';
import { useExperimentPlan } from '../utils/hooks';

export default () => {
  const dispatch: Dispatch<RootAction> = useDispatch();
  const uid = useSearchParam(SearchQueryKey.UID) ?? undefined;
  const workerId = useSearchParam(SearchQueryKey.WORKER_ID) ?? undefined;
  const exp = useExperimentPlan();

  useMount(async () => {
    dispatch(
      startTrials({ uid: uid !== undefined ? Number(uid) : undefined, playerId: workerId, exp }),
    );
  });

  return (
    <Box direction="column" align="center" gap="medium" pad="medium">
      <Box align="center" elevation="large" fill>
        <Box background="brand" fill align="center" pad="medium" justify="center">
          <Heading>{texts[Page.LOADING_TRIALS].text}</Heading>
          <Spinner />
        </Box>
      </Box>
    </Box>
  );
};
