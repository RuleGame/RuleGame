import React, { useCallback, useState } from 'react';
import { Button, Form, Heading, TextArea } from 'grommet';
import { GiPlayButton } from 'react-icons/gi';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { Dispatch } from 'redux';
import { entranceButtonCy } from '../constants/data-cy-builders';
import { BoardObjectType, Game, RuleArray } from '../@types';
import { RootAction } from '../store/actions';
import randomObjectsCreator from '../store/epics/__helpers__/objects-creator';
import { ruleArraysSelector } from '../store/selectors';
import { addRuleArray } from '../store/actions/rule-arrays';
import { loadRuleArray } from '../store/actions/rule-row';

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
    (ruleArray: RuleArray, boardObjects: BoardObjectType[] = randomObjectsCreator(5)) =>
      dispatch(loadRuleArray(boardObjects, ruleArray)),
    [dispatch],
  );
  const [boardObjects, setBoardObjects] = useState('');
  const ruleArrays = useSelector(ruleArraysSelector);

  return (
    <StyledEntrancePage>
      <StyledHeading>Entrance Page</StyledHeading>
      <StyledGameList>
        {ruleArrays.map((ruleArray) => (
          <Button
            className="btn"
            icon={<GiPlayButton />}
            label="Game 1"
            onClick={() => {
              try {
                if (boardObjects.trim().length > 0) {
                  // eslint-disable-next-line no-eval
                  dispatchSetRuleArray(ruleArray.value, JSON.parse(boardObjects));
                } else {
                  dispatchSetRuleArray(ruleArray.value);
                }
              } catch (e) {
                // eslint-disable-next-line no-alert
                alert(`Problem parsing the board objects:\n${boardObjects}`);
              }
            }}
            data-cy={entranceButtonCy(Game.GAME1)}
          />
        ))}
      </StyledGameList>
      <Form
        onSubmit={useCallback(() => {
          dispatch(addRuleArray.request(enteredAtomArray));
        }, [dispatch, enteredAtomArray])}
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
