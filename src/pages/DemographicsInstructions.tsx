import React from 'react';
import { Box, Button, Paragraph } from 'grommet';
import { useDispatch } from 'react-redux';
import { Dispatch } from 'redux';
import { RootAction } from '../store/actions';
import { nextPage } from '../store/actions/page';

export default () => {
  const dispatch: Dispatch<RootAction> = useDispatch();

  return (
    <Box direction="column" align="center" gap="medium" pad="medium">
      <Box align="center" elevation="large" fill>
        <Box background="brand" fill align="center" pad="medium" justify="center">
          <Paragraph fill>
            {"Thank you! We'll now ask a few questions, and you'll be done!"}
          </Paragraph>
          <Button label="Next" primary onClick={() => dispatch(nextPage())} />
        </Box>
      </Box>
    </Box>
  );
};
