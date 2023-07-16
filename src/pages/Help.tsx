import { Box } from 'grommet';
import { Page } from '../constants/Page';
import texts from '../constants/texts';
import Introduction from './Introduction';

export default () => {
  return (
    <Box direction="column" align="center" gap="medium" pad="medium">
      <Box align="center" elevation="large" fill>
        <Introduction />
        <Box margin={{ top: 'small' }}>{texts[Page.INTRODUCTION].helpMessage}</Box>
      </Box>
    </Box>
  );
};
