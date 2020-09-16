import React, { useState } from 'react';
import { Box, Button, CheckBox, Form, Paragraph, Text } from 'grommet';
import { useDispatch } from 'react-redux';
import { Dispatch } from 'redux';
import { RootAction } from '../store/actions';
import { nextPage } from '../store/actions/page';

const Consent = () => {
  const dispatch: Dispatch<RootAction> = useDispatch();
  const [accept, setAccept] = useState(false);

  return (
    <Box direction="column" align="center" gap="medium" pad="medium">
      <Box align="center" elevation="large" fill>
        <Box background="brand" fill align="center" pad="medium" justify="center">
          <Paragraph fill>
            {`The HIT you are about to do is sponsored by University of Wisconsin-Madison. It is part
            of a protocol titled “Language and Human Cognition”. The task you are asked to do
            involves making simple responses to images, text, and/or sounds. For example, you may be
            asked how typical a picture of a dog is of dogs in general, to name a drawing, decide
            what word a sound makes you think of, to choose which visual pattern best completes a
            sequence of patterns, or indicate how vividly you see in your “mind’s eye."`}
            <strong>HIT instructions will be provided on the next screen. </strong>
          </Paragraph>
          <Paragraph fill>
            {`This task has no anticipated risks nor direct benefits. If you have any questions or
            concerns about this HIT please contact the principal investigator: Dr. Gary Lupyan at
            lupyan@wisc.edu. If you are not satisfied with response of the research team, have more
            questions, or want to talk with someone about your rights as a research participant, you
            should contact University of Wisconsin’s Education Research and Social & Behavioral
            Science IRB Office at 608-263-2320. You are free to decline to participate or to end
            participation at any time for any reason.`}
          </Paragraph>
          <Form onSubmit={() => dispatch(nextPage())}>
            <Box align="center" gap="small">
              <Text weight="bold">
                By clicking this box, I consent to participate in this task.
              </Text>
              <CheckBox onChange={(e) => setAccept(e.target.checked)} checked={accept} required />
              <Button label="Start Experiment" primary type="submit" />
            </Box>
          </Form>
        </Box>
      </Box>
    </Box>
  );
};

export default Consent;
