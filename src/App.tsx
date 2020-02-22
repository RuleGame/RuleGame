import { Grommet } from 'grommet';
import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Dispatch } from 'redux';
import { hot } from 'react-hot-loader/root';

import { DndProvider } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import EntrancePage from './pages/EntrancePage';
import RuleGamePage from './pages/RuleGamePage';
import { layersSelector, pageSelector } from './store/selectors';
import Layers from './components/Layers';
import { removeLayer } from './store/actions/layers';
import { RootAction } from './store/actions';
import Notifications from './components/Notifications';

const App = () => {
  const dispatch: Dispatch<RootAction> = useDispatch();
  const page = useSelector(pageSelector);
  const handleCloseLayer = useCallback((layerId: string) => dispatch(removeLayer(layerId)), [
    dispatch,
  ]);
  const layers = useSelector(layersSelector);

  return (
    <DndProvider backend={HTML5Backend}>
      <Grommet full plain>
        {page === 'Entrance' ? <EntrancePage /> : <RuleGamePage />}
        <Layers onLayerClose={handleCloseLayer} layers={layers} />
        <Notifications />
      </Grommet>
    </DndProvider>
  );
};

export default hot(App);
