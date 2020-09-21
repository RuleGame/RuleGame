import React from 'react';
import { Box, Heading, Paragraph, Text } from 'grommet';
import { useQuery } from 'react-query';
import { api, METHOD } from '../utils/api';
import useWorkerId from '../utils/use-worker-id';

const Debriefing = () => {
  const workerId = useWorkerId();
  const { data, isLoading } = useQuery(`${workerId}-INTRODUCTION`, () =>
    api('/w2020/game-data/GameService2/player', METHOD.POST, { playerId: workerId }, {}),
  );
  const completionCode = isLoading ? '<loading...>' : data?.data.completionCode;

  return (
    <Box direction="column" align="center" gap="medium" pad="medium">
      <Box align="center" elevation="large" fill>
        <Box background="brand" fill align="center" pad="medium" justify="center">
          <Heading>Thank you for participating!</Heading>
          <Paragraph fill>
            Your completion code is <Text weight="bold">{completionCode}</Text>. Please paste the
            code into the mTurk Box.
          </Paragraph>
          <Paragraph fill>The purpose of this HIT is to... TODO Placeholder</Paragraph>
          <Paragraph fill>You may now close this window.</Paragraph>
        </Box>
      </Box>
    </Box>
  );
};

export default Debriefing;
