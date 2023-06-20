import { Box, Button, CheckBox, Form, Text } from 'grommet';
import React, { useState } from 'react';
import { useQuery } from 'react-query';
import { useDispatch } from 'react-redux';
import { useSearchParam } from 'react-use';
import { Dispatch } from 'redux';
import sanitizeHtml from 'sanitize-html';
import Spinner from '../components/Spinner';
import { SearchQueryKey } from '../constants';
import { Page } from '../constants/Page';
import texts from '../constants/texts';
import { RootAction } from '../store/actions';
import { addLayer } from '../store/actions/layers';
import { nextPage } from '../store/actions/page';
import { METHOD, api } from '../utils/api';
import { useExperimentPlan } from '../utils/hooks';

const Consent = () => {
  const dispatch: Dispatch<RootAction> = useDispatch();
  const [accept, setAccept] = useState(false);
  const uid = useSearchParam(SearchQueryKey.UID) ?? undefined;
  const workerIdSearchParam = useSearchParam(SearchQueryKey.WORKER_ID) ?? undefined;
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
        data: { error: getPageError, errmsg: getPageErrorMsg, ...getPageData },
      } = await api('/game-data/PregameService/getPage', METHOD.GET, undefined, {
        playerId,
        name: 'consent.html',
      });

      if (getPageError) {
        throw Error(getPageErrorMsg);
      }

      return { workerId: playerId, ...getPageData, value: sanitizeHtml(getPageData.value) };
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
            {/* eslint-disable-next-line react/no-danger */}
            <div dangerouslySetInnerHTML={{ __html: data.value }} />
            <Form onSubmit={() => dispatch(nextPage())}>
              <Box align="center" gap="small">
                <Text weight="bold">{texts[Page.CONSENT].checkBoxLabel}</Text>
                <CheckBox onChange={(e) => setAccept(e.target.checked)} checked={accept} required />
                <Button label={texts[Page.CONSENT].nextButtonLabel} primary type="submit" />
              </Box>
            </Form>
          </Box>
        ) : (
          <Spinner />
        )}
      </Box>
    </Box>
  );
};

export default Consent;
