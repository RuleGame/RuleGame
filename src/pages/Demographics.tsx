import React, { useMemo } from 'react';
import { Box, Text } from 'grommet';
import { useDispatch } from 'react-redux';
import { Dispatch } from 'redux';
import { ItemValue, Model, Survey, SurveyModel } from 'survey-react';
import { RootAction } from '../store/actions';
import 'survey-react/survey.css';
import { recordDemographics } from '../store/actions/board';
import { usePregameService } from '../utils/hooks';
import Spinner from '../components/Spinner';

const Demographics: React.FunctionComponent = () => {
  const dispatch: Dispatch<RootAction> = useDispatch();
  const { data, error } = usePregameService('/game-data/PregameService/getPage', {
    name: 'demographics.json',
  });
  const model = useMemo(() => {
    if (data !== undefined) {
      const elements = (JSON.parse(data.value) as Partial<ItemValue>[])
        .filter(({ goodnessGE, goodnessLT }) => {
          // Only filter out items that have both a goodnessScore calculated and a goodness condition
          if (
            data.goodnessScore !== undefined &&
            (goodnessGE !== undefined || goodnessLT !== undefined)
          ) {
            if (goodnessGE !== undefined && data.goodnessScore >= goodnessGE) {
              return true;
            } else if (goodnessLT !== undefined && data.goodnessScore < goodnessLT) {
              return true;
            }

            return false;
          }

          return true;
        })
        .map((element) => {
          delete element.goodnessGE;
          delete element.goodnessLT;

          return element;
        });

      return new Model({ elements });
    }
  }, [data]);

  return (
    <Box direction="column" align="center" gap="medium" pad="medium">
      {model !== undefined ? (
        <Survey
          model={model}
          onComplete={(survey: SurveyModel) => {
            const { data } = survey;
            dispatch(recordDemographics(data));
          }}
        />
      ) : error ? (
        <Text>An error ocurred: {error.message}</Text>
      ) : (
        <Spinner />
      )}
    </Box>
  );
};

export default Demographics;
