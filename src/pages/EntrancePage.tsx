import React, { useCallback, useState } from 'react';
import { Button, Heading, Form, TextArea, FormField } from 'grommet';
import { GiPlayButton } from 'react-icons/gi';
import styled from 'styled-components';
import { useDispatch } from 'react-redux';
import { goToPage } from '../store/actions/page';
import { entranceButtonCy } from '../constants/data-cy-builders';
import { BoardObjectType, Game } from '../@types';
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
    (ruleArray: string, boardObjects: BoardObjectType[] = randomObjectsCreator(5)) => {
      try {
        dispatch(
          setRuleArray(
            boardObjects,
            ruleArray
              .split('\n')
              .filter((line) => line.trim().length > 0)
              .map((ruleRow) => ruleParser(ruleRow)),
            ruleArray.split('\n').filter((line) => line.trim().length > 0),
          ),
        );
      } catch (e) {
        // eslint-disable-next-line no-alert
        alert(`Error parsing rule array or board objects:\n${e.message}`);
      }
    },
    [dispatch],
  );
  const [boardObjects, setBoardObjects] = useState('');

  return (
    <StyledEntrancePage>
      <StyledHeading>Entrance Page</StyledHeading>
      <StyledGameList>
        <Button
          className="btn"
          icon={<GiPlayButton />}
          label="Game 1"
          onClick={useCallback(() => {
            try {
              if (boardObjects.trim().length > 0) {
                // eslint-disable-next-line no-eval
                dispatchSetRuleArray(ruleArray, eval(boardObjects));
              } else {
                dispatchSetRuleArray(ruleArray);
              }
            } catch (e) {
              // eslint-disable-next-line no-alert
              alert(`Problem parsing the board objects:\n${boardObjects}`);
            }
          }, [dispatchSetRuleArray])}
          data-cy={entranceButtonCy(Game.GAME1)}
        />
      </StyledGameList>
      <Form
        onSubmit={useCallback(() => {
          try {
            if (boardObjects.trim().length > 0) {
              // eslint-disable-next-line no-eval
              dispatchSetRuleArray(enteredAtomArray, eval(boardObjects));
            } else {
              dispatchSetRuleArray(enteredAtomArray);
            }
          } catch (e) {
            // eslint-disable-next-line no-alert
            alert(`Problem parsing the board objects:\n${boardObjects}`);
          }
        }, [enteredAtomArray, dispatchSetRuleArray, boardObjects])}
      >
        Custom BoardObjects
        <TextArea
          name="BoardObjects"
          value={boardObjects}
          onChange={useCallback(
            (e: React.ChangeEvent<HTMLTextAreaElement>) => setBoardObjects(e.target.value),
            [setEnteredAtomArray],
          )}
          rows={20}
          placeholder={`Custom BoardObjects:
Type:
{
  id: string;
  color: Color;
  shape: Shape;
  x: number;
  y: number;
}

Example:
[
  {
    color: 'red',
    id: '1',
    shape: 'square',
    x: 1,
    y: 2,
  },
  {
    color: 'blue',
    id: '2',
    shape: 'circle',
    x: 2,
    y: 3,
  },
]
`}
        />
        Custom RuleArray
        <TextArea
          name="RuleArray"
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
