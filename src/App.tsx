import { Grommet } from 'grommet';
import React from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import EntrancePage from './pages/EntrancePage';
import RuleGamePage from './pages/RuleGamePage';
import { pageSelector } from './store/selectors';

const StyledApp = styled.div<{}>`
  width: 100vw;
  height: 100vh;
`;

const App = () => {
  const page = useSelector(pageSelector);
  return (
    <Grommet plain>
      <StyledApp>{page === 'Entrance' ? <EntrancePage /> : <RuleGamePage />}</StyledApp>
    </Grommet>
  );
};

export default App;
