import React from 'react';
import { Box, Heading } from 'grommet';
import { useDispatch } from 'react-redux';
import { Dispatch } from 'redux';
import { useMount } from 'react-use';
import { RootAction } from '../store/actions';
import { startTrials } from '../store/actions/board';
import Spinner from '../components/Spinner';
import { useExperimentPlan, useWorkerId } from '../utils/hooks';
import texts from '../constants/texts';
import { Page } from '../constants/Page';

export default () => {
  const dispatch: Dispatch<RootAction> = useDispatch();
  const workerId = useWorkerId();
  const exp = useExperimentPlan();

  useMount(async () => {
    dispatch(startTrials(workerId, exp));
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
