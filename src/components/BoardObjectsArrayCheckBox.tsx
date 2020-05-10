import React from 'react';
import { CheckBox } from 'grommet';
import { useSelector } from 'react-redux';
import { boardObjectsArraysByIdSelector } from '../store/selectors';
import { RootState } from '../store/reducers';

const BoardObjectsArrayCheckBox: React.FunctionComponent<{
  boardObjectsArrayId: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  checked: boolean;
}> = ({ boardObjectsArrayId, onChange, checked }) => {
  const boardObjectsArrayName = useSelector<RootState, string>(
    (state) => boardObjectsArraysByIdSelector(state)[boardObjectsArrayId].name,
  );

  return <CheckBox label={boardObjectsArrayName} onChange={onChange} checked={checked} />;
};

export default BoardObjectsArrayCheckBox;
