import { Box, Button, CheckBox, Form, FormField, Heading, TextArea, TextInput } from 'grommet';
import React, { useState } from 'react';
import { Dispatch } from 'redux';
import { useDispatch } from 'react-redux';
import { addBoardObjectsArray } from '../store/actions/board-objects-arrays';
import { RootAction } from '../store/actions';

const AddBoardObjectsForm: React.FunctionComponent = () => {
  const [boardObjectsArray, setBoardObjectsArray] = useState('');
  const [name, setName] = useState('');
  const dispatch: Dispatch<RootAction> = useDispatch();
  const [addToAllGames, setAddToAllGames] = useState(true);

  return (
    <Box elevation="large" align="center" pad="medium">
      <Heading level="2">Add a New Custom Board Objects Array</Heading>
      <Form onSubmit={() => dispatch(addBoardObjectsArray.request(name, boardObjectsArray))}>
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
