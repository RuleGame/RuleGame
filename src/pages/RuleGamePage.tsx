import React from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import Game from '../components/Game';
import HistoryLog from '../components/HistoryLog';
// import { boardObjectsByIdSelector, logsSelector } from '../store/selectors';

const StyledRuleGamePage = styled.div<{}>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const StyledGame = styled(Game)<{}>`
  margin: auto;
  width: 100vh;
  max-width: 100vw;
  height: 100vw;
  max-height: 90vh;
  padding: 1em;
  box-sizing: border-box;
`;

const RuleGamePage = () => {
  // const logs = useSelector(logsSelector);

  return (
    <StyledRuleGamePage>
      <StyledGame />
      {/* <HistoryLog logs={logs} /> */}
    </StyledRuleGamePage>
  );
};

export default RuleGamePage;
