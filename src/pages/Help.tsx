import React, { useState } from 'react';
import { Box, Button } from 'grommet';
import { useQuery } from 'react-query';
import { api, METHOD } from '../utils/api';
import { useExperimentPlan, useWorkerId } from '../utils/hooks';
import texts from '../constants/texts';
import { Page } from '../constants/Page';

export default () => {
  const workerId = useWorkerId();
  const exp = useExperimentPlan();
  const [step, setStep] = useState(0);
  const { data, isLoading } = useQuery(`${workerId}-INTRODUCTION`, () =>
    api('/w2020/game-data/GameService2/player', METHOD.POST, { playerId: workerId, exp }, {}),
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
