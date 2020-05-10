import React from 'react';
import { Grommet } from 'grommet';
import { hot } from 'react-hot-loader/root';
import { useSelector } from 'react-redux';
import Layers from './components/Layers';
import Notifications from './components/Notifications';
import EntrancePage from './pages/EntrancePage';
import RuleGamePage from './pages/RuleGamePage';
import { pageSelector } from './store/selectors';

const App = () => {
  const page = useSelector(pageSelector);

  return (
    <Grommet full plain>
      {page === 'Entrance' ? <EntrancePage /> : <RuleGamePage />}
      <Layers />
      <Notifications />
    </Grommet>
  );
};

export default hot(App);
