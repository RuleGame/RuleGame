import React from 'react';
import { Box, Heading } from 'grommet';
import { useDispatch } from 'react-redux';
import { Dispatch } from 'redux';
import { useMount, useSearchParam } from 'react-use';
import { RootAction } from '../store/actions';
import { startTrials } from '../store/actions/board';
import { SEARCH_QUERY_KEYS } from '../constants';
import Spinner from '../components/Spinner';

export default () => {
  const dispatch: Dispatch<RootAction> = useDispatch();
  const workerId = useSearchParam(SEARCH_QUERY_KEYS.WORKER_ID) ?? 'testWorkerId';

  useMount(async () => {
    dispatch(startTrials(workerId));
  });

  return (
    <Box direction="column" align="center" gap="medium" pad="medium">
      <Box align="center" elevation="large" fill>
        <Box background="brand" fill align="center" pad="medium" justify="center">
          <Heading>Loading Trials...</Heading>
          <Spinner />
        </Box>
      </Box>
    </Box>
  );
};
