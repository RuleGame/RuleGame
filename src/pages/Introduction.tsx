import { Box, Button } from 'grommet';
import React, { useState } from 'react';
import { useQuery } from 'react-query';
import { useDispatch, useSelector } from 'react-redux';
import { Dispatch } from 'redux';
import Spinner from '../components/Spinner';
import { Page } from '../constants/Page';
import texts from '../constants/texts';
import { RootAction } from '../store/actions';
import { nextPage } from '../store/actions/page';
import { workerIdSelector } from '../store/selectors/board';
import { api, METHOD } from '../utils/api';
import { useExperimentPlan } from '../utils/hooks';

export default () => {
  const dispatch: Dispatch<RootAction> = useDispatch();
  const workerId = useSelector(workerIdSelector);
  const exp = useExperimentPlan();
  const [step, setStep] = useState(0);
  const { data } = useQuery(`${workerId}-INTRODUCTION`, () =>
    api('/game-data/GameService2/player', METHOD.POST, { playerId: workerId, exp }, {}),
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
                label={
                  step === texts[Page.INTRODUCTION].text(data?.data.trialList?.[0].init).length - 1
                    ? texts[Page.INTRODUCTION].startExperimentButtonLabel
                    : texts[Page.INTRODUCTION].nextButtonLabel
                }
                primary
                onClick={() => {
                  if (
                    step ===
                    texts[Page.INTRODUCTION].text(data?.data.trialList?.[0].init).length - 1
                  ) {
                    dispatch(nextPage());
                  } else {
                    setStep((step) => step + 1);
                  }
                }}
              />
            </Box>
          </Box>
        ) : (
          <Spinner />
        )}
      </Box>
    </Box>
  );
};
