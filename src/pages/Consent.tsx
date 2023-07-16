import { Box, Button, CheckBox, Form, Text } from 'grommet';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Dispatch } from 'redux';
import GetPageHtml from '../components/GetPageHtml';
import { Page } from '../constants/Page';
import texts from '../constants/texts';
import { RootAction } from '../store/actions';
import { nextPage } from '../store/actions/page';

const Consent = () => {
  const dispatch: Dispatch<RootAction> = useDispatch();
  const [accept, setAccept] = useState(false);

  return (
    <Box direction="column" align="center" gap="medium" pad="medium">
      <Box align="center" elevation="large" fill>
        <GetPageHtml name="consent.html">
          {() => (
            <Form onSubmit={() => dispatch(nextPage())}>
              <Box align="center" gap="small">
                <Text weight="bold">{texts[Page.CONSENT].checkBoxLabel}</Text>
                <CheckBox onChange={(e) => setAccept(e.target.checked)} checked={accept} required />
                <Button label={texts[Page.CONSENT].nextButtonLabel} primary type="submit" />
              </Box>
            </Form>
          )}
        </GetPageHtml>
      </Box>
    </Box>
  );
};

export default Consent;
