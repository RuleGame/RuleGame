import React, { useState } from 'react';
import { Box, Button, CheckBox, Form, Text } from 'grommet';
import { useDispatch } from 'react-redux';
import { Dispatch } from 'redux';
import { RootAction } from '../store/actions';
import { nextPage } from '../store/actions/page';
import texts from '../constants/texts';
import { Page } from '../constants/Page';

const Consent = () => {
  const dispatch: Dispatch<RootAction> = useDispatch();
  const [accept, setAccept] = useState(false);

  return (
    <Box direction="column" align="center" gap="medium" pad="medium">
      <Box align="center" elevation="large" fill>
        <Box background="brand" fill align="center" pad="medium" justify="center">
          {texts[Page.CONSENT].text}
          <Form onSubmit={() => dispatch(nextPage())}>
            <Box align="center" gap="small">
              <Text weight="bold">{texts[Page.CONSENT].checkBoxLabel}</Text>
              <CheckBox onChange={(e) => setAccept(e.target.checked)} checked={accept} required />
              <Button label={texts[Page.CONSENT].nextButtonLabel} primary type="submit" />
            </Box>
          </Form>
        </Box>
      </Box>
    </Box>
  );
};

export default Consent;
