import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import Game from '../components/Game';
import HistoryLog from '../components/HistoryLog';
import { setRule } from '../store/actions/game';
import { boardObjectsByIdSelector, logsSelector, ruleSelector } from '../store/selectors/index';

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
  const dispatch = useDispatch();
  const rule = useSelector(ruleSelector);
  const boardObjectsById = useSelector(boardObjectsByIdSelector);
  const logs = useSelector(logsSelector);

  return (
    <StyledRuleGamePage>
      <label htmlFor="nearest">
        <input
          type="radio"
          id="nearest"
          name="rule"
          checked={rule === 'nearest'}
          onChange={useCallback(
            (event: React.ChangeEvent<HTMLInputElement>) =>
              event.target.value && dispatch(setRule('nearest')),
            [dispatch],
          )}
        />
        nearest
      </label>
      <label htmlFor="clockwise">
        <input
          type="radio"
          id="clockwise"
          name="rule"
          checked={rule === 'clockwise'}
          onChange={useCallback(
            (event: React.ChangeEvent<HTMLInputElement>) =>
              event.target.value && dispatch(setRule('clockwise')),
            [dispatch],
          )}
        />
        clockwise
      </label>
      <StyledGame boardObjectsById={boardObjectsById} />
      <HistoryLog logs={logs} />
    </StyledRuleGamePage>
  );
};

export default RuleGamePage;
