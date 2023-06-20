import { Box, Button, Heading, Image } from 'grommet';
import React, { useState } from 'react';
import { useQuery } from 'react-query';
import { useDispatch } from 'react-redux';
import { useSearchParam } from 'react-use';
import { Dispatch } from 'redux';
import Spinner from '../components/Spinner';
import { Page } from '../constants/Page';
import texts from '../constants/texts';
import { RootAction } from '../store/actions';
import { addLayer } from '../store/actions/layers';
import { nextPage } from '../store/actions/page';
import { METHOD, api, getBookletPageUrl } from '../utils/api';
import { useExperimentPlan } from '../utils/hooks';
import { SearchQueryKey } from '../constants';

export default () => {
  const dispatch: Dispatch<RootAction> = useDispatch();
  const uid = useSearchParam(SearchQueryKey.UID) ?? undefined;
  const workerIdSearchParam = useSearchParam(SearchQueryKey.WORKER_ID) ?? undefined;
  const [step, setStep] = useState(0);
  const exp = useExperimentPlan();
  const { data } = useQuery(
    `${workerIdSearchParam}-INTRODUCTION`,
    async () => {
      const {
        data: { error, errmsg, playerId },
      } = await api(
        '/game-data/GameService2/player',
        METHOD.POST,
        {
          ...(workerIdSearchParam && { playerId: workerIdSearchParam }),
          ...(uid && { uid: Number(uid) }),
          exp,
        },
        {},
      );
      if (error) {
        throw Error(errmsg);
      }

      const {
        data: { error: getBookletSizeError, errmsg: getBookletSizeErrorMsg, ...getBookletSizeData },
      } = await api('/game-data/PregameService/getBookletSize', METHOD.GET, undefined, {
        playerId,
      });

      if (getBookletSizeError) {
        throw Error(getBookletSizeErrorMsg);
      }

      return { workerId: playerId, ...getBookletSizeData };
    },
    {
      retry: false,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      onError: (e: Error) => dispatch(addLayer('An Error Ocurred', e.message, [])),
    },
  );

  return (
    <Box direction="column" align="center" gap="medium" pad="medium">
      <Box align="center" elevation="large" fill>
        {data !== undefined ? (
          <Box background="brand" fill align="center" pad="medium" justify="center">
            <Heading>RuleGame Challenge</Heading>
            <Box width="xlarge" align="center">
              <Image
                src={getBookletPageUrl(data.workerId, step)}
                width="100%"
                height="100%"
                style={{ objectFit: 'contain' }}
              />
            </Box>
            <Box direction="row" gap="small" justify="center">
              <Button
                label={texts[Page.INTRODUCTION].backButtonLabel}
                disabled={step === 0}
                onClick={() => setStep((step) => step - 1)}
              />
              <Button
                label={
                  step === data.bookletSize - 1
                    ? texts[Page.INTRODUCTION].startExperimentButtonLabel
                    : texts[Page.INTRODUCTION].nextButtonLabel
                }
                primary
                onClick={() => {
                  if (step === data.bookletSize - 1) {
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
