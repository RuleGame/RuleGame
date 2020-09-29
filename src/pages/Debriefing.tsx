import React from 'react';
import { Box } from 'grommet';
import { useQuery } from 'react-query';
import { api, METHOD } from '../utils/api';
import { useExperimentPlan, useWorkerId } from '../utils/hooks';
import texts from '../constants/texts';
import { Page } from '../constants/Page';

const Debriefing = () => {
  const workerId = useWorkerId();
  const exp = useExperimentPlan();
  const { data, isLoading } = useQuery(`${workerId}-INTRODUCTION`, () =>
    api('/w2020/game-data/GameService2/player', METHOD.POST, { playerId: workerId, exp }, {}),
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
