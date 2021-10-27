import { Box } from 'grommet';
import React from 'react';
import { useQuery } from 'react-query';
import { useSelector } from 'react-redux';
import { useSearchParam } from 'react-use';
import { SearchQueryKey } from '../constants';
import { Page } from '../constants/Page';
import texts from '../constants/texts';
import { workerIdSelector } from '../store/selectors/board';
import { api, METHOD } from '../utils/api';
import { useExperimentPlan } from '../utils/hooks';

const Debriefing = () => {
  const workerId = useSelector(workerIdSelector);
  const exp = useExperimentPlan();
  const uid = useSearchParam(SearchQueryKey.UID) ?? undefined;
  const { data, isLoading } = useQuery(`${workerId}-DEBRIEFING`, () =>
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
  const completionCode = isLoading ? '<loading...>' : data?.data.completionCode ?? '?';

  return (
    <Box direction="column" align="center" gap="medium" pad="medium">
      <Box align="center" elevation="large" fill>
        <Box background="brand" fill align="center" pad="medium" justify="center">
          {texts[Page.DEBRIEFING].text(completionCode)}
        </Box>
      </Box>
    </Box>
  );
};

export default Debriefing;
