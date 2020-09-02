import React from 'react';
import { Grommet } from 'grommet';
import { hot } from 'react-hot-loader/root';
import { useSelector } from 'react-redux';
import { useMount, useSearchParam } from 'react-use';
import { useQuery } from 'react-query';
import Layers from './components/Layers';
import Notifications from './components/Notifications';
import EntrancePage from './pages/EntrancePage';
import RuleGamePage from './pages/RuleGamePage';
import { pageSelector } from './store/selectors';
import { QUERY_KEYS, WORKER_ID_SEARCH_QUERY } from './constants';
import { api, METHOD } from './utils/api';

const App = () => {
  const page = useSelector(pageSelector);
  const workerId = useSearchParam(WORKER_ID_SEARCH_QUERY);

  useMount(async () => {
    const data = await api(
      '/w2020/game-data/GameService/startTrial',
      METHOD.POST,
      { playerId: workerId! },
      {},
    );
    console.log(data);
  });

  return (
    <Grommet full plain>
      {page === 'Entrance' ? <EntrancePage /> : <RuleGamePage />}
      <Layers />
      <Notifications />
    </Grommet>
  );
};

export default hot(App);
