import { Box, Button, Heading, Image } from 'grommet';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Dispatch } from 'redux';
import QueryComponent from '../components/QueryComponent';
import { Page } from '../constants/Page';
import texts from '../constants/texts';
import { RootAction } from '../store/actions';
import { nextPage } from '../store/actions/page';
import { getBookletPageUrl } from '../utils/api';
import { usePregameService } from '../utils/hooks';

export default () => {
  const dispatch: Dispatch<RootAction> = useDispatch();
  const [step, setStep] = useState(0);

  const queryResult = usePregameService('/game-data/PregameService/getBookletSize', {});

  return (
    <Box direction="column" align="center" gap="medium" pad="medium">
      <Box align="center" elevation="large" fill>
        <QueryComponent queryResult={queryResult}>
          {(data) => (
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
              <Box direction="row" gap="small" justify="center" margin="small">
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
          )}
        </QueryComponent>
      </Box>
    </Box>
  );
};
