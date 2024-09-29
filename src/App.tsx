import { Box, Button, Grommet, Heading, Paragraph, Text } from 'grommet';
import { Expand } from 'grommet-icons';
import React, { useRef, useState } from 'react';
import { hot } from 'react-hot-loader/root';
import { MdFullscreen } from 'react-icons/all';
import { useQuery } from 'react-query';
import { useDispatch, useSelector } from 'react-redux';
import { useEvent, useMount, useSearchParam } from 'react-use';
import Layers from './components/Layers';
import Notifications from './components/Notifications';
import Spinner from './components/Spinner';
import { API_HOST_ORIGIN, SearchQueryKey, VERSION } from './constants';
import { Page } from './constants/Page';
import texts from './constants/texts';
import Consent from './pages/Consent';
import Debriefing from './pages/Debriefing';
import Demographics from './pages/Demographics';
import DemographicsInstructions from './pages/DemographicsInstructions';
import Help from './pages/Help';
import Introduction from './pages/Introduction';
import LoadingTrials from './pages/LoadingTrials';
import Trials from './pages/Trials';
import { setWorkerId } from './store/actions/board';
import { goToPage } from './store/actions/page';
import { pageSelector } from './store/selectors/page';
import { api, METHOD } from './utils/api';
import { getWorkerId } from './utils/hooks';

const App = () => {
  const dispatch = useDispatch();
  const page = useSelector(pageSelector);
  const ref = useRef<HTMLDivElement>(null);
  const requireFullscreen = useSearchParam(SearchQueryKey.FULLSCREEN)?.toLowerCase() === 'true';
  // Show instructions if help is true
  const help = useSearchParam(SearchQueryKey.HELP)?.toLowerCase() === 'true';
  const versionPage = useSearchParam(SearchQueryKey.VERSION)?.toLowerCase() === 'true';
  const [fullscreen, setFullscreen] = useState(false);
  const intro = (useSearchParam(SearchQueryKey.INTRO)?.toLowerCase() ?? 'true') === 'true';
  const workerId = getWorkerId();

  useMount(() => {
    if (workerId !== undefined) {
      dispatch(setWorkerId(workerId));
    }
    if (!intro) {
      dispatch(goToPage(Page.LOADING_TRIALS));
    }
  });

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
              <Text weight="bold">{VERSION ?? 'Missing Client Version'} (2024-09-28-a)</Text>
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
