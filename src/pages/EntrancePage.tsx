import React, { useCallback, useState } from 'react';
import { Box, Button, Form, FormField, Heading, RadioButtonGroup, TextArea } from 'grommet';
import { useDispatch, useSelector } from 'react-redux';
import { Dispatch } from 'redux';
import { BoardObjectType, RuleArray } from '../@types';
import { RootAction } from '../store/actions';
import randomObjectsCreator from '../store/epics/__helpers__/objects-creator';
import { boardObjectsArraysSelector, ruleArraysSelector } from '../store/selectors';
import { addRuleArray } from '../store/actions/rule-arrays';
import { loadRuleArray } from '../store/actions/rule-row';
import { addBoardObjectsArray } from '../store/actions/board-objects-arrays';

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
  const boardObjectsArrays = useSelector(boardObjectsArraysSelector);
  const [selectedRuleArrayIndex, setSelectedRuleArrayIndex] = useState(0);
  const [selectedBoardObjectsArrayIndex, setSelectedBoardObjectsArrayIndex] = useState(0);

  return (
    <Box>
      <Heading>Entrance Page</Heading>
      <Form
        onSubmit={() =>
          dispatchSetRuleArray(
            ruleArrays[selectedRuleArrayIndex].value,
            boardObjectsArrays[selectedBoardObjectsArrayIndex].value,
          )
        }
      >
        <FormField
          label={`Board Objects Arrays ${boardObjectsArrays.length === 0 ? '(none)' : ''}`}
          name="boardObjectsArrays"
          pad
        >
          <RadioButtonGroup
            name="Board Objects Arrays"
            value={String(selectedBoardObjectsArrayIndex)}
            options={boardObjectsArrays.map((_, i) => ({
              label: `Board Objects Array ${i}`,
              value: String(i),
            }))}
            onChange={(event) => setSelectedBoardObjectsArrayIndex(Number(event.target.value))}
          />
        </FormField>
        <FormField
          label={`Rule Arrays ${ruleArrays.length === 0 ? '(none)' : ''}`}
          name="ruleArrays"
          pad
        >
          <RadioButtonGroup
            name="Board Objects Arrays"
            value={String(selectedRuleArrayIndex)}
            options={ruleArrays.map((_, i) => ({
              label: `Rule Array ${i}`,
              value: String(i),
            }))}
            onChange={(event) => setSelectedRuleArrayIndex(Number(event.target.value))}
          />
        </FormField>
        <Button
          type="submit"
          label="Start"
          disabled={ruleArrays.length === 0 || boardObjectsArrays.length === 0}
        />
      </Form>
      <Form onSubmit={() => dispatch(addBoardObjectsArray.request(boardObjects))}>
        <FormField label="Custom BoardObjects" name="BoardObjects" value={boardObjects}>
          <TextArea
            rows={20}
            onChange={useCallback(
              (e: React.ChangeEvent<HTMLTextAreaElement>) => setBoardObjects(e.target.value),
              [setBoardObjects],
            )}
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
        </FormField>
        <Button type="submit" label="Add" />
      </Form>
      <Form
        onSubmit={useCallback(() => {
          dispatch(addRuleArray.request(enteredAtomArray));
        }, [dispatch, enteredAtomArray])}
      >
        <FormField label="Custom RuleArray" name="RuleArray">
          <TextArea
            value={enteredAtomArray}
            onChange={useCallback(
              (e: React.ChangeEvent<HTMLTextAreaElement>) => setEnteredAtomArray(e.target.value),
              [setEnteredAtomArray],
            )}
          />
        </FormField>

        <Button type="submit" primary label="Add" disabled={enteredAtomArray.trim().length === 0} />
      </Form>
    </Box>
  );
};

export default EntrancePage;
