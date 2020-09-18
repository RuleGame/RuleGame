import React from 'react';
import { Box, Button, Heading, Paragraph } from 'grommet';
import { useDispatch } from 'react-redux';
import { Dispatch } from 'redux';
import { useQuery } from 'react-query';
import { RootAction } from '../store/actions';
import { nextPage } from '../store/actions/page';
import useWorkerId from '../utils/use-worker-id';
import { api, METHOD } from '../utils/api';

export default () => {
  const dispatch: Dispatch<RootAction> = useDispatch();
  const workerId = useWorkerId();
  const { data, isLoading } = useQuery(`${workerId}-INTRODUCTION`, () =>
    api('/w2020/game-data/GameService2/player', METHOD.POST, { playerId: workerId }, {}),
  );
  const numRules = isLoading ? '...' : data?.data.trialList.length;

  return (
    <Box direction="column" align="center" gap="medium" pad="medium">
      <Box align="center" elevation="large" fill>
        <Box background="brand" fill align="center" pad="medium" justify="center">
          <Heading>RuleGame Challenge</Heading>
          <Paragraph fill>
            Welcome to the RuleGame challenge. There are {numRules} different rules. Each rule
            describes an allowed way of clearing some <b>colored objects</b> from a game board. To
            clear an object, you must grab it with the mouse, and drag it to the correct bucket.
            When you release it at the correct bucket, the bucket smiles, and the object’s place
            turns into a check mark. If you release it at the wrong bucket, the bucket makes an ugly
            face. After you have cleared an entire display, you can give up, or ask for a new
            display. After you have cleared a few displays without too many errors, you can take a
            chance to guess at the rule. Please be patient after you guess because we require human
            judges to review your guesses.
          </Paragraph>
          <Button label="Next" primary onClick={() => dispatch(nextPage())} />
        </Box>
      </Box>
    </Box>
  );
};
