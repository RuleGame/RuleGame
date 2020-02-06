import { Grommet } from 'grommet';
import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { Dispatch } from 'redux';

import EntrancePage from './pages/EntrancePage';
import RuleGamePage from './pages/RuleGamePage';
import { layersSelector, pageSelector } from './store/selectors';
import Layers from './components/Layers';
import { removeLayer } from './store/actions/layers';
import { RootAction } from './store/actions';

const StyledApp = styled.div<{}>``;

const App = () => {
  const dispatch: Dispatch<RootAction> = useDispatch();
  const page = useSelector(pageSelector);
  const handleCloseLayer = useCallback((layerId: string) => dispatch(removeLayer(layerId)), [
    dispatch,
  ]);
  const layers = useSelector(layersSelector);

  return (
    <Grommet full plain>
      <StyledApp>{page === 'Entrance' ? <EntrancePage /> : <RuleGamePage />}</StyledApp>
      <Layers onLayerClose={handleCloseLayer} layers={layers} />
    </Grommet>
  );
};

export default App;
