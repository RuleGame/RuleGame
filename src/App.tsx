import React, { useCallback } from 'react';
import { Grommet } from 'grommet';
import { DndProvider } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import { hot } from 'react-hot-loader/root';
import { useDispatch, useSelector } from 'react-redux';
import { Dispatch } from 'redux';
import Layers from './components/Layers';
import Notifications from './components/Notifications';
import EntrancePage from './pages/EntrancePage';
import RuleGamePage from './pages/RuleGamePage';
import { RootAction } from './store/actions';
import { removeLayer } from './store/actions/layers';
import { layersSelector, pageSelector } from './store/selectors';

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
        {/* <Box width="min(70vh, 100vw)" height="min(70vh, 100vw)">
          <BoardEditor />
        </Box> */}
        <Layers onLayerClose={handleCloseLayer} layers={layers} />
        <Notifications />
      </Grommet>
    </DndProvider>
  );
};

export default hot(App);
