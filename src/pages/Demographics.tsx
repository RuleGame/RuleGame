import React from 'react';
import { Box } from 'grommet';
import { useDispatch } from 'react-redux';
import { Dispatch } from 'redux';
import { ItemValue, Model, Survey, SurveyModel } from 'survey-react';
import { RootAction } from '../store/actions';
import 'survey-react/survey.css';
import { recordDemographics } from '../store/actions/board';

const questions: Partial<ItemValue>[] = [
  {
    type: 'radiogroup',
    name: 'gender',
    colCount: 0,
    isRequired: true,
    title: 'What is your gender?',
    choices: ['Male', 'Female', 'Other', 'NA|Prefer not to say'],
  },
  {
    type: 'radiogroup',
    name: 'native',
    isRequired: true,
    title: 'Are you a native English speaker',
    choices: ['1|Yes', '0|No'],
    colCount: 0,
  },
  {
    type: 'text',
    name: 'native language',
    visibleIf: "{native}='0'",
    title: 'Please indicate your native language or languages:',
  },
  {
    type: 'text',
    name: 'languages',
    title: "What other languages do you speak? Please enter 'none' if just English.",
  },
  { type: 'text', name: 'age', title: 'How old are you?', width: 'auto' },
  {
    type: 'radiogroup',
    name: 'degree',
    isRequired: true,
    title:
      'What is the highest degree or level of school you have completed. If currently enrolled, indicate highest degree received.',
    choices: [
      '1|Less than high school',
      '2|High school diploma',
      '3|Some college, no degree',
      "4|Associate's degree",
      "5|Bachelor's degree",
      '6|PhD, law, or medical degree',
      'NA|Prefer not to say',
    ],
  },
  {
    type: 'text',
    name: 'comments',
    isRequired: false,
    title: 'If you have any comments for us, please enter them here',
  },
];

const model = new Model({ elements: questions });

const Demographics: React.FunctionComponent = () => {
  const dispatch: Dispatch<RootAction> = useDispatch();

  return (
    <Box direction="column" align="center" gap="medium" pad="medium">
      <Survey
        model={model}
        onComplete={(survey: SurveyModel) => {
          const { data } = survey;
          dispatch(recordDemographics(data));
        }}
      />
    </Box>
  );
};

export default Demographics;
