import React from 'react';
import { Grommet } from 'grommet';
import { hot } from 'react-hot-loader/root';
import { useSelector } from 'react-redux';
import Layers from './components/Layers';
import Notifications from './components/Notifications';
import RuleGamePage from './pages/RuleGamePage';
import { pageSelector } from './store/selectors';
import Introduction from './pages/Introduction';
import Consent from './pages/Consent';
import Trials from './pages/Trials';
import DemographicsInstructions from './pages/DemographicsInstructions';
import { Page } from './constants/Page';
import LoadingTrials from './pages/LoadingTrials';

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
        <RuleGamePage />
      )}
      <Layers />
      <Notifications />
    </Grommet>
  );
};

export default hot(App);
