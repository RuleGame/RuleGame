import React, { useCallback, useRef, useState } from 'react';
import {
  Box,
  Button,
  Drop,
  Form,
  FormField,
  Heading,
  RadioButtonGroup,
  TextArea,
  Text,
} from 'grommet';
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
  const startRef = useRef<HTMLButtonElement>(null);
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
    <Box direction="column" align="center" gap="medium">
      <Box elevation="large" align="center">
        <Heading>Enter Game</Heading>
        <Box pad="small">
          <Form
            onSubmit={() =>
              dispatchSetRuleArray(
                ruleArrays[selectedRuleArrayIndex].value,
                boardObjectsArrays[selectedBoardObjectsArrayIndex].value,
              )
            }
          >
            <Box direction="row" gap="medium">
              <FormField
                label={`Board Objects Arrays ${boardObjectsArrays.length === 0 ? '(empty)' : ''}`}
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
                  onChange={(event) =>
                    setSelectedBoardObjectsArrayIndex(Number(event.target.value))
                  }
                />
              </FormField>
              <FormField
                label={`Rule Arrays ${ruleArrays.length === 0 ? '(empty)' : ''}`}
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
            </Box>
            <Box direction="row" justify="center">
              <Button
                type="submit"
                label="Start"
                disabled={ruleArrays.length === 0 || boardObjectsArrays.length === 0}
                ref={startRef}
                primary
              >
                {({ hover }: { hover: boolean }) => (
                  <>
                    <Text>Start</Text>
                    {startRef.current &&
                      hover &&
                      (ruleArrays.length === 0 || boardObjectsArrays.length === 0) && (
                        <Drop align={{ top: 'bottom' }} target={startRef.current} plain>
                          <Box margin="xsmall" pad="small" round background="dark-3">
                            Add at least 1 Rule Array and 1 Board Objects Array
                          </Box>
                        </Drop>
                      )}
                  </>
                )}
              </Button>
            </Box>
          </Form>
        </Box>
      </Box>
      <Box elevation="large" align="center">
        <Heading level="2">New Rule Arrays/Board Objects Form</Heading>
        <Box direction="row" gap="medium" pad="medium" justify="evenly" wrap>
          <Form onSubmit={() => dispatch(addBoardObjectsArray.request(boardObjects))}>
            <FormField label="New Board Objects" name="BoardObjects" value={boardObjects} pad>
              <TextArea
                rows={20}
                cols={50}
                wrap="off"
                onChange={useCallback(
                  (e: React.ChangeEvent<HTMLTextAreaElement>) => setBoardObjects(e.target.value),
                  [setBoardObjects],
                )}
                size="small"
                placeholder={`Custom Board Objects:
Board Object Shape:
{
  "id": string;
  "color": Color;
  "shape": Shape;
  "x": number;
  "y": number;
}

Array Example:
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
            <Button type="submit" label="Add" disabled={boardObjects.trim().length === 0} />
          </Form>
          <Form
            onSubmit={useCallback(() => {
              dispatch(addRuleArray.request(enteredAtomArray));
            }, [dispatch, enteredAtomArray])}
          >
            <FormField label="New Rule Array" name="RuleArray" pad>
              <TextArea
                value={enteredAtomArray}
                onChange={useCallback(
                  (e: React.ChangeEvent<HTMLTextAreaElement>) =>
                    setEnteredAtomArray(e.target.value),
                  [setEnteredAtomArray],
                )}
                size="small"
                rows={20}
                cols={50}
                wrap="off"
                placeholder="(10,square,*,*,[1,2]) (10,*,green,10,[2,3])
(*,*,*,*,[ps,pc])
(*,*,*,*,[(p+1)%4])"
              />
            </FormField>
            <Button type="submit" label="Add" disabled={enteredAtomArray.trim().length === 0} />
          </Form>
        </Box>
      </Box>
    </Box>
  );
};

export default EntrancePage;
