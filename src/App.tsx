import React, { useRef, useState } from 'react';
import { Box, Button, Grommet, Heading, Paragraph } from 'grommet';
import { hot } from 'react-hot-loader/root';
import { useSelector } from 'react-redux';
import { useEvent, useSearchParam } from 'react-use';
import { MdFullscreen } from 'react-icons/all';
import { Expand } from 'grommet-icons';
import Layers from './components/Layers';
import Notifications from './components/Notifications';
import Introduction from './pages/Introduction';
import Consent from './pages/Consent';
import Trials from './pages/Trials';
import DemographicsInstructions from './pages/DemographicsInstructions';
import { Page } from './constants/Page';
import LoadingTrials from './pages/LoadingTrials';
import { pageSelector } from './store/selectors/page';
import Demographics from './pages/Demographics';
import Debriefing from './pages/Debriefing';
import { SEARCH_QUERY_KEYS } from './constants';

const App = () => {
  const page = useSelector(pageSelector);
  const ref = useRef<HTMLDivElement>(null);
  const requireFullscreen = useSearchParam(SEARCH_QUERY_KEYS.FULLSCREEN)?.toLowerCase() === 'true';
  const [fullscreen, setFullscreen] = useState(false);
  useEvent('fullscreenchange', () => {
    if (document.fullscreenElement !== null) {
      setFullscreen(true);
    } else {
      setFullscreen(false);
    }
  });

  return (
    <Grommet full plain>
      <Box ref={ref} fill>
        {!requireFullscreen || (requireFullscreen && fullscreen) ? (
          page === Page.INTRODUCTION ? (
            <Introduction />
          ) : page === Page.CONSENT ? (
            <Consent />
          ) : page === Page.LOADING_TRIALS ? (
            <LoadingTrials />
          ) : page === Page.TRIALS ? (
            <Trials />
          ) : page === Page.DEMOGRAPHICS_INSTRUCTIONS ? (
            <DemographicsInstructions />
          ) : page === Page.DEMOGRAPHICS ? (
            <Demographics />
          ) : page === Page.DEBRIEFING ? (
            <Debriefing />
          ) : (
            <Paragraph>Unknown page. Try reloading</Paragraph>
          )
        ) : (
          <Box margin="xlarge" align="center">
            <Expand />
            <Heading>Fullscreen is required</Heading>
            <Button
              onClick={() => document.documentElement.requestFullscreen()}
              primary
              label="Enter fullscreen"
              icon={<MdFullscreen />}
            />
          </Box>
        )}

        <Layers />
        <Notifications />
      </Box>
    </Grommet>
  );
};

export default hot(App);
