import { Box, Button } from 'grommet';
import React, { useState } from 'react';
import { useQuery } from 'react-query';
import { useSelector } from 'react-redux';
import { useSearchParam } from 'react-use';
import { SearchQueryKey } from '../constants';
import { Page } from '../constants/Page';
import texts from '../constants/texts';
import { workerIdSelector } from '../store/selectors/board';
import { api, METHOD } from '../utils/api';
import { useExperimentPlan } from '../utils/hooks';

export default () => {
  const workerId = useSelector(workerIdSelector);
  const exp = useExperimentPlan();
  const [step, setStep] = useState(0);
  const uid = useSearchParam(SearchQueryKey.UID) ?? undefined;
  const { data, isLoading } = useQuery(`${workerId}-HELP`, () =>
    api(
      '/game-data/GameService2/player',
      METHOD.POST,
      {
        exp,
        ...(uid !== undefined && { uid: Number(uid) }),
        ...(workerId !== undefined && { playerId: workerId }),
      },
      {},
    ),
  );
  const numRules = isLoading ? '...' : data?.data.trialList.length ?? '?';
  const instructions = texts[Page.INTRODUCTION].text(numRules);

  return (
    <Box direction="column" align="center" gap="medium" pad="medium">
      <Box align="center" elevation="large" fill>
        <Box background="brand" fill align="center" pad="medium" justify="center">
          {instructions[step]}
          <Box direction="row" gap="small" justify="center">
            <Button
              label={texts[Page.INTRODUCTION].backButtonLabel}
              disabled={step === 0}
              onClick={() => setStep((step) => step - 1)}
            />
            <Button
              label={texts[Page.INTRODUCTION].nextButtonLabel}
              primary
              disabled={step === instructions.length - 1}
              onClick={() => setStep((step) => step + 1)}
            />
          </Box>
          <Box margin={{ top: 'small' }}>{texts[Page.INTRODUCTION].helpMessage}</Box>
        </Box>
      </Box>
    </Box>
  );
};
