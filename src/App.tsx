import React, { useRef, useState } from 'react';
import { Box, Button, Grommet, Heading, Paragraph, Text } from 'grommet';
import { hot } from 'react-hot-loader/root';
import { useSelector } from 'react-redux';
import { useEvent, useSearchParam } from 'react-use';
import { MdFullscreen } from 'react-icons/all';
import { Expand } from 'grommet-icons';
import { useQuery } from 'react-query';
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
import { API_HOST_ORIGIN, SEARCH_QUERY_KEYS, VERSION } from './constants';
import texts from './constants/texts';
import Help from './pages/Help';
import { api, METHOD } from './utils/api';
import Spinner from './components/Spinner';

const App = () => {
  const page = useSelector(pageSelector);
  const ref = useRef<HTMLDivElement>(null);
  const requireFullscreen = useSearchParam(SEARCH_QUERY_KEYS.FULLSCREEN)?.toLowerCase() === 'true';
  // Show instructions if help is true
  const help = useSearchParam(SEARCH_QUERY_KEYS.HELP)?.toLowerCase() === 'true';
  const versionPage = useSearchParam(SEARCH_QUERY_KEYS.VERSION)?.toLowerCase() === 'true';
  const [fullscreen, setFullscreen] = useState(false);
  useEvent('fullscreenchange', () => {
    if (document.fullscreenElement !== null) {
      setFullscreen(true);
    } else {
      setFullscreen(false);
    }
  });

  const { data: versionData, isLoading: isVersionLoading } = useQuery(
    'VERSION',
    () => api('/game-data/GameService2/getVersion', METHOD.GET, undefined, {}),
    { enabled: versionPage, retry: false },
  );

  return (
    <Grommet full plain>
      <Box ref={ref} fill>
        {help ? (
          <Help />
        ) : versionPage ? (
          <Box>
            <Text>
              Client Version [environment-commitHash]:{' '}
              <Text weight="bold">{VERSION ?? 'Missing Client Version'}</Text>
            </Text>
            <Text>
              Server URL: <Text weight="bold">{API_HOST_ORIGIN ?? 'Missing Server URL'}</Text>
            </Text>
            <Text>
              Server Version:{' '}
              <Text weight="bold">
                {isVersionLoading ? (
                  <Spinner />
                ) : (
                  versionData?.data ?? 'Could Not Fetch Server Version'
                )}
              </Text>
            </Text>
          </Box>
        ) : (
          <>
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
                <Heading>{texts.fullscreenPrompt}</Heading>
                <Button
                  onClick={() => document.documentElement.requestFullscreen()}
                  primary
                  label={texts.fullscreenButtonLabel}
                  icon={<MdFullscreen />}
                />
              </Box>
            )}
          </>
        )}

        <Layers />
        <Notifications />
      </Box>
    </Grommet>
  );
};

export default hot(App);
