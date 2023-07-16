import { Box, Button } from 'grommet';
import { useDispatch } from 'react-redux';
import { Dispatch } from 'redux';
import GetPageHtml from '../components/GetPageHtml';
import { RootAction } from '../store/actions';
import { nextPage } from '../store/actions/page';

export default () => {
  const dispatch: Dispatch<RootAction> = useDispatch();

  return (
    <Box direction="column" align="center" gap="medium" pad="medium">
      <Box align="center" elevation="large" fill>
        <GetPageHtml name="demographics_instructions.html">
          {() => <Button label="Next" primary onClick={() => dispatch(nextPage())} />}
        </GetPageHtml>
      </Box>
    </Box>
  );
};
