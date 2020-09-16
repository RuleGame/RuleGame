import React from 'react';
import { Box, Heading, Paragraph } from 'grommet';

const Debriefing = () => {
  return (
    <Box direction="column" align="center" gap="medium" pad="medium">
      <Box align="center" elevation="large" fill>
        <Box background="brand" fill align="center" pad="medium" justify="center">
          <Heading>Thank you for participating!</Heading>
          <Paragraph fill>The purpose of this HIT is to... TODO Placeholder</Paragraph>
          <Paragraph fill>You may now close this window.</Paragraph>
        </Box>
      </Box>
    </Box>
  );
};

export default Debriefing;
