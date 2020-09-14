import React from 'react';
import { Grommet, Paragraph } from 'grommet';
import { hot } from 'react-hot-loader/root';
import { useSelector } from 'react-redux';
import Layers from './components/Layers';
import Notifications from './components/Notifications';
import Introduction from './pages/Introduction';
import Consent from './pages/Consent';
import Trials from './pages/Trials';
import DemographicsInstructions from './pages/DemographicsInstructions';
import { Page } from './constants/Page';
import LoadingTrials from './pages/LoadingTrials';
import { pageSelector } from './store/selectors/page';

const App = () => {
  const page = useSelector(pageSelector);

  return (
    <Grommet full plain>
      {page === Page.INTRODUCTION ? (
        <Introduction />
      ) : page === Page.CONSENT ? (
        <Consent />
      ) : page === Page.LOADING_TRIALS ? (
        <LoadingTrials />
      ) : page === Page.TRIALS ? (
        <Trials />
      ) : page === Page.DEMOGRAPHICS_INSTRUCTIONS ? (
        <DemographicsInstructions />
      ) : (
        <Paragraph>Unknown page. Try reloading</Paragraph>
      )}
      <Layers />
      <Notifications />
    </Grommet>
  );
};

export default hot(App);
