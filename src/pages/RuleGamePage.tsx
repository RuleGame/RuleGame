import React from 'react';
import styled from 'styled-components';
import Game from '../components/Game';

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

const RuleGamePage = () => (
  <StyledRuleGamePage>
    <StyledGame />
  </StyledRuleGamePage>
);

export default RuleGamePage;
