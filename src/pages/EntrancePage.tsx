import React, { useCallback } from 'react';
import { Button, Heading } from 'grommet';
import { GiPlayButton } from 'react-icons/gi';
import styled from 'styled-components';
import { useDispatch } from 'react-redux';
import { goToPage } from '../store/actions/page';
import { entranceButtonCy } from '../constants/data-cy-builders';
import { Game } from '../@types';

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
  const dispatch = useDispatch();

  return (
    <StyledEntrancePage>
      <StyledHeading>Entrance Page</StyledHeading>
      <StyledGameList>
        <Button
          className="btn"
          icon={<GiPlayButton />}
          label="Game 1"
          onClick={useCallback(() => dispatch(goToPage('RuleGame', Game.GAME1)), [dispatch])}
          data-cy={entranceButtonCy(Game.GAME1)}
        />
        <Button
          className="btn"
          icon={<GiPlayButton />}
          label="Game 2"
          onClick={useCallback(() => dispatch(goToPage('RuleGame', Game.GAME2)), [dispatch])}
          data-cy={entranceButtonCy(Game.GAME2)}
        />
      </StyledGameList>
    </StyledEntrancePage>
  );
};

export default EntrancePage;
