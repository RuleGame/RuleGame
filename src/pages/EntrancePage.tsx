import React, { useCallback, useState } from 'react';
import { Button, Heading, Form, TextArea } from 'grommet';
import { GiPlayButton } from 'react-icons/gi';
import styled from 'styled-components';
import { useDispatch } from 'react-redux';
import { goToPage } from '../store/actions/page';
import { entranceButtonCy } from '../constants/data-cy-builders';
import { Game } from '../@types';
import { RootAction } from '../store/actions';
import { Dispatch } from 'redux';
import ruleArray from '../assets/rule-array.txt';
import { setRuleArray } from '../store/actions/rule-row';
import randomObjectsCreator from '../store/epics/__helpers__/objects-creator';
import ruleParser from '../utils/atom-parser';

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
  const [enteredAtomArray, setEnteredAtomArray] = useState('');
  const dispatchSetRuleArray = useCallback(
    (ruleArray: string) => {
      try {
        dispatch(
          setRuleArray(
            randomObjectsCreator(5),
            ruleArray
              .split('\n')
              .filter((line) => line.trim().length > 0)
              .map((ruleRow) => ruleParser(ruleRow)),
            ruleArray.split('\n').filter((line) => line.trim().length > 0),
          ),
        );
      } catch (e) {
        // eslint-disable-next-line no-alert
        alert(`Error parsing rule array:\n${e.message}`);
      }
    },
    [dispatch],
  );

  return (
    <StyledEntrancePage>
      <StyledHeading>Entrance Page</StyledHeading>
      <StyledGameList>
        <Button
          className="btn"
          icon={<GiPlayButton />}
          label="Game 1"
          onClick={useCallback(() => dispatchSetRuleArray(ruleArray), [dispatchSetRuleArray])}
          data-cy={entranceButtonCy(Game.GAME1)}
        />
      </StyledGameList>
      <Form
        onSubmit={useCallback(() => dispatchSetRuleArray(enteredAtomArray), [
          enteredAtomArray,
          dispatchSetRuleArray,
        ])}
      >
        <TextArea
          name="name"
          value={enteredAtomArray}
          onChange={useCallback(
            (e: React.ChangeEvent<HTMLTextAreaElement>) => setEnteredAtomArray(e.target.value),
            [setEnteredAtomArray],
          )}
        />
        <Button
          type="submit"
          primary
          label="Use Custom Atom"
          disabled={enteredAtomArray.trim().length === 0}
        />
      </Form>
    </StyledEntrancePage>
  );
};

export default EntrancePage;
