import { Box, Button, Form, FormField, Heading, TextArea, TextInput } from 'grommet';
import { useDispatch } from 'react-redux';
import { Dispatch } from 'redux';
import React, { useCallback, useState } from 'react';
import { RootAction } from '../store/actions';
import { addRuleArray } from '../store/actions/rule-arrays';

const AddRuleArrayForm: React.FunctionComponent = () => {
  const [name, setName] = useState('');
  const [ruleArray, setRuleArray] = useState('');
  const dispatch: Dispatch<RootAction> = useDispatch();

  return (
    <Box elevation="large" align="center" pad="medium">
      <Heading level="2">Add a New Rule Array</Heading>
      <Form
        onSubmit={useCallback(() => dispatch(addRuleArray.request(name, ruleArray)), [
          dispatch,
          name,
          ruleArray,
        ])}
      >
        <Box align="center">
          <Box align="start">
            <FormField label="Name">
              <TextInput
                placeholder="Name"
                onChange={useCallback((e) => setName(e.target.value), [])}
                value={name}
              />
            </FormField>
            <FormField label="New Rule Array">
              <TextArea
                required
                value={ruleArray}
                onChange={useCallback((e) => setRuleArray(e.target.value), [])}
                size="small"
                rows={20}
                cols={50}
                wrap="off"
                placeholder="(10,square,*,*,[1,2]) (10,*,green,10,[2,3])
(*,*,*,*,[ps,pc])
(*,*,*,*,[(p+1)%4])"
              />
            </FormField>
          </Box>
          <Button type="submit" label="Add Rule Array" primary />
        </Box>
      </Form>
    </Box>
  );
};

export default AddRuleArrayForm;
