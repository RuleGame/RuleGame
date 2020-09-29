import React from 'react';
import { Box } from 'grommet';
import { useDispatch } from 'react-redux';
import { Dispatch } from 'redux';
import { Model, Survey, SurveyModel } from 'survey-react';
import { RootAction } from '../store/actions';
import 'survey-react/survey.css';
import { recordDemographics } from '../store/actions/board';
import demographics from '../constants/demographics';

const model = new Model({ elements: demographics });

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
