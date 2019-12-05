import React, { useCallback } from 'react';
import { Button, Heading } from 'grommet';
import { GiPlayButton } from 'react-icons/gi';
import styled from 'styled-components';
import { useDispatch } from 'react-redux';
import { goToPage } from '../store/actions/page';
import { entranceButtonCy } from '../constants/data-cy-builders';
import { Game } from '../@types';
import { RootAction } from '../store/actions';
import { Dispatch } from 'redux';

const StyledEntrancePage = styled.div<{}>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const StyledHeading = styled(Heading)<{}>``;

const StyledGameList = styled.div<{}>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  .btn {
    margin-bottom: 1em;
  }
`;

const EntrancePage = () => {
  const dispatch: Dispatch<RootAction> = useDispatch();

  return (
    <StyledEntrancePage>
      <StyledHeading>Entrance Page</StyledHeading>
      <StyledGameList>
        <Button
          className="btn"
          icon={<GiPlayButton />}
          label="Game 1"
          onClick={useCallback(() => dispatch(goToPage('RuleGame', 'rule-array.txt')), [dispatch])}
          data-cy={entranceButtonCy(Game.GAME1)}
        />
      </StyledGameList>
    </StyledEntrancePage>
  );
};

export default EntrancePage;
