import { Box, Button, CheckBox, Form, FormField, Heading, TextArea, TextInput } from 'grommet';
import React, { useState } from 'react';
import { Dispatch } from 'redux';
import { useDispatch } from 'react-redux';
import stringify from 'json-stringify-pretty-compact';
import { addBoardObjectsArray } from '../store/actions/board-objects-arrays';
import { RootAction } from '../store/actions';
import { addLayer, removeLayer } from '../store/actions/layers';
import BoardEditor from './BoardEditor';

const AddBoardObjectsForm: React.FunctionComponent = () => {
  const [boardObjectsArray, setBoardObjectsArray] = useState('');
  const [name, setName] = useState('');
  const dispatch: Dispatch<RootAction> = useDispatch();
  const [addToAllGames, setAddToAllGames] = useState(false);

  return (
    <Box elevation="large" align="center" pad="medium">
      <Heading level="2">Add a New Custom Board Objects Array</Heading>
      <Form
        onSubmit={() =>
          dispatch(addBoardObjectsArray.request(name, boardObjectsArray, addToAllGames))
        }
      >
        <Box align="center">
          <Box align="start">
            <FormField label="Name">
              <TextInput
                onChange={(e) => setName(e.target.value)}
                value={name}
                placeholder="Name"
                required
              />
            </FormField>
            <Button
              label="Use Interactive Board Editor"
              onClick={() =>
                dispatch(
                  addLayer(
                    'Board Editor',
                    <BoardEditor
                      onLoad={(boardObjects) => {
                        setBoardObjectsArray(stringify(boardObjects, { maxLength: 20 }));
                        dispatch(removeLayer('board-editor'));
                      }}
                      key={boardObjectsArray}
                    />,
                    [
                      {
                        key: 'discard',
                        label: 'Discard',
                        action: addLayer(
                          'Unsaved board',
                          'Are you sure you want to discard',
                          [
                            {
                              key: 'yes',
                              label: 'Yes',
                              action: [removeLayer('board-editor'), removeLayer('confirm-discard')],
                            },
                            { key: 'no', label: 'No', action: removeLayer('confirm-discard') },
                          ],
                          'confirm-discard',
                        ),
                      },
                    ],
                    'board-editor',
                    false,
                    false,
                  ),
                )
              }
            />
            <FormField label="New Board Objects" name="BoardObjects" pad>
              <TextArea
                required
                rows={20}
                cols={50}
                wrap="off"
                onChange={(e) => setBoardObjectsArray(e.target.value)}
                value={boardObjectsArray}
                size="small"
                placeholder={`Custom Board Objects (JSON format):
Board Object Shape:
{
  id?: string; // If omitted, id will be position.
  color: Color;
  shape: Shape;
  x: number;
  y: number;
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
            <FormField label="Add to all Games">
              <CheckBox
                checked={addToAllGames}
                onChange={(event) => setAddToAllGames(event.target.checked)}
              />
            </FormField>
          </Box>
          <Button primary type="submit" label="Add Board Objects Array" />
        </Box>
      </Form>
    </Box>
  );
};

export default AddBoardObjectsForm;
