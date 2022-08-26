import { Box, Button } from 'grommet';
import React, { useState } from 'react';
import { useQuery } from 'react-query';
import { useSelector } from 'react-redux';
import { useSearchParam } from 'react-use';
import Spinner from '../components/Spinner';
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
  const { data } = useQuery(`${workerId}-HELP`, () =>
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

  return (
    <Box direction="column" align="center" gap="medium" pad="medium">
      <Box align="center" elevation="large" fill>
        {data?.data.trialList?.[0] !== undefined ? (
          <Box background="brand" fill align="center" pad="medium" justify="center">
            {texts[Page.INTRODUCTION].text(data?.data.trialList?.[0].init)[step]}
            <Box direction="row" gap="small" justify="center">
              <Button
                label={texts[Page.INTRODUCTION].backButtonLabel}
                disabled={step === 0}
                onClick={() => setStep((step) => step - 1)}
              />
              <Button
                label={texts[Page.INTRODUCTION].nextButtonLabel}
                primary
                disabled={
                  step === texts[Page.INTRODUCTION].text(data?.data.trialList?.[0].init).length - 1
                }
                onClick={() => setStep((step) => step + 1)}
              />
            </Box>
            <Box margin={{ top: 'small' }}>{texts[Page.INTRODUCTION].helpMessage}</Box>
          </Box>
        ) : (
          <Spinner />
        )}
      </Box>
    </Box>
  );
};
