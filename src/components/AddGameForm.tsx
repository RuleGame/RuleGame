import {
  Box,
  Button,
  CheckBox,
  Form,
  FormField,
  Heading,
  RadioButton,
  Text,
  TextInput,
} from 'grommet';
import { useDispatch, useSelector } from 'react-redux';
import { Dispatch } from 'redux';
import React, { useState } from 'react';
import { View } from 'grommet-icons';
import { RootAction } from '../store/actions';
import { addGame } from '../store/actions/games';
import { boardObjectsArraysSelector, ruleArraysSelector } from '../store/selectors';
import BoardObjectsArrayCheckBox from './BoardObjectsArrayCheckBox';
import { addLayer, removeLayer } from '../store/actions/layers';

const AddGameForm: React.FunctionComponent = () => {
  const dispatch: Dispatch<RootAction> = useDispatch();
  const [name, setName] = useState('');
  const boardObjectsArrays = useSelector(boardObjectsArraysSelector);
  // The state may have ids that are either removed or missing after adding new ids.
  // But that is ok because removed ids are ignored and
  // missing ids are implemented to be treated as true.
  // Whenever a checkbox state has changed, the id will be added to the state.
  const [isCheckedBoardObjectsArrays, setIsCheckedBoardObjectsArrays] = useState<{
    [id: string]: boolean;
  }>(() =>
    boardObjectsArrays.reduce(
      (acc, { id }) => ({
        ...acc,
        [id]: true,
      }),
      {},
    ),
  );
  const [selectedRuleArray, setSelectedRuleArray] = useState<string | undefined>(undefined);
  const ruleArrays = useSelector(ruleArraysSelector);
  const [useRandomBoardObjects, setUseRandomBoardObjects] = useState(true);
  const [numRandomBoardObjects, setNumRandomBoardObjects] = useState(5);

  return (
    <Box elevation="large" align="center" pad="medium">
      <Heading level="2">Add a New Game</Heading>
      <Form
        onSubmit={() =>
          dispatch(
            addGame(
              name,
              selectedRuleArray as string,
              boardObjectsArrays
                .filter(({ id }) => isCheckedBoardObjectsArrays[id] ?? true)
                .map(({ id }) => id),
              useRandomBoardObjects,
              numRandomBoardObjects,
            ),
          )
        }
      >
        <Box align="center" gap="medium">
          <Box align="start">
            <FormField label="Game Name">
              <TextInput
                required
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Name"
              />
            </FormField>
            <FormField label="New Rule Array" name="RuleArray" pad>
              <Box>
                {ruleArrays.length > 0 ? (
                  <Box direction="column" justify="between">
                    {ruleArrays.map((ruleArray) => (
                      <Box direction="row" key={ruleArray.id}>
                        <Button
                          onClick={() =>
                            dispatch(
                              addLayer(
                                `${ruleArray.name} Rule Array Preview:`,
                                `${ruleArray.stringified}\n${
                                  ruleArray.order ? `Order: ${JSON.stringify(ruleArray.order)}` : ''
                                }`,
                                [
                                  {
                                    key: 'close',
                                    label: 'Close',
                                    action: removeLayer('rule-array-preview'),
                                  },
                                ],
                                'rule-array-preview',
                              ),
                            )
                          }
                          icon={<View />}
                        />
                        <RadioButton
                          checked={selectedRuleArray === ruleArray.id}
                          label={<Text>{ruleArray.name}</Text>}
                          onChange={(event) =>
                            event.target.checked && setSelectedRuleArray(ruleArray.id)
                          }
                          name="RuleArray"
                          required
                        />
                      </Box>
                    ))}
                  </Box>
                ) : (
                  <Text margin="small" size="xsmall" color="grey">
                    (Empty... Add Rule Arrays)
                  </Text>
                )}
              </Box>
            </FormField>
            <CheckBox
              label="Use Random Board Objects"
              checked={useRandomBoardObjects}
              onChange={({ target: { checked } }) => setUseRandomBoardObjects(checked)}
            />
            {useRandomBoardObjects ? (
              <FormField label="Num Random Objects Per Display">
                <TextInput
                  type="number"
                  value={numRandomBoardObjects}
                  onChange={({ target: { value } }) =>
                    setNumRandomBoardObjects(Number(value.trim()))
                  }
                />
              </FormField>
            ) : (
              <FormField label="Board Objects Arrays">
                <Box gap="none">
                  {boardObjectsArrays.length > 0 ? (
                    boardObjectsArrays.map((boardObjectsArray) => (
                      <Box direction="row" justify="start" key={boardObjectsArray.id}>
                        <Button
                          onClick={() =>
                            dispatch(
                              addLayer(
                                `${boardObjectsArray.name} Board Objects Array Preview:`,
                                boardObjectsArray.stringified,
                                [
                                  {
                                    key: 'close',
                                    label: 'Close',
                                    action: removeLayer('board-objects-array-preview'),
                                  },
                                ],
                                'board-objects-array-preview',
                              ),
                            )
                          }
                          icon={<View />}
                        />
                        <BoardObjectsArrayCheckBox
                          boardObjectsArrayId={boardObjectsArray.id}
                          checked={isCheckedBoardObjectsArrays[boardObjectsArray.id] ?? true}
                          onChange={({ target: { checked } }) =>
                            setIsCheckedBoardObjectsArrays((isCheckedBoardObjectsArrays) => ({
                              ...isCheckedBoardObjectsArrays,
                              [boardObjectsArray.id]: checked,
                            }))
                          }
                        />
                      </Box>
                    ))
                  ) : (
                    <Text margin="small" size="xsmall" color="grey">
                      (Empty... Add Board Objects Arrays)
                    </Text>
                  )}
                </Box>
              </FormField>
            )}
          </Box>
          <Button primary type="submit" label="Add Game" />
        </Box>
      </Form>
    </Box>
  );
};

export default AddGameForm;
