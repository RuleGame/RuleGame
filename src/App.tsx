import React from 'react';
import { Grommet } from 'grommet';
import { DndProvider } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
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
    <DndProvider backend={HTML5Backend}>
      <Grommet full plain>
        {page === 'Entrance' ? <EntrancePage /> : <RuleGamePage />}
        <Layers />
        <Notifications />
      </Grommet>
    </DndProvider>
  );
};

export default hot(App);
