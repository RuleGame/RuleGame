import React, { useCallback, useState } from 'react';
import { Button, Form, Heading, TextArea } from 'grommet';
import { GiPlayButton } from 'react-icons/gi';
import styled from 'styled-components';
import { useDispatch } from 'react-redux';
import { Dispatch } from 'redux';
import { entranceButtonCy } from '../constants/data-cy-builders';
import { BoardObjectType, Game } from '../@types';
import { RootAction } from '../store/actions';
import ruleArray from '../assets/rule-array.txt';
import { loadRuleArrayRequest } from '../store/actions/rule-row';
import randomObjectsCreator from '../store/epics/__helpers__/objects-creator';

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
    (ruleArray: string, boardObjects: BoardObjectType[] = randomObjectsCreator(5)) =>
      dispatch(loadRuleArrayRequest(boardObjects, ruleArray)),
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
                dispatchSetRuleArray(ruleArray, JSON.parse(boardObjects));
              } else {
                dispatchSetRuleArray(ruleArray);
              }
            } catch (e) {
              // eslint-disable-next-line no-alert
              alert(`Problem parsing the board objects:\n${boardObjects}`);
            }
          }, [dispatchSetRuleArray, boardObjects])}
          data-cy={entranceButtonCy(Game.GAME1)}
        />
      </StyledGameList>
      <Form
        onSubmit={useCallback(() => {
          try {
            if (boardObjects.trim().length > 0) {
              // eslint-disable-next-line no-eval
              dispatchSetRuleArray(enteredAtomArray, JSON.parse(boardObjects));
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
            [],
          )}
          rows={20}
          placeholder={`Custom BoardObjects:
Type:
{
  "id": string;
  "color": Color;
  "shape": Shape;
  "x": number;
  "y": number;
}

Example:
[
  {
    "color": "red",
    "id": "1",
    "shape": "square",
    "x": 1,
    "y": 2
  },
  {
    "color": "blue",
    "id": "2",
    "shape": "circle",
    "x": 2,
    "y": 3
  }
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
