import React from 'react';
import { CheckBox } from 'grommet';
import { useSelector } from 'react-redux';
import { RootState } from '../store/reducers';
import { boardObjectsArraysByIdSelector } from '../store/selectors/board-object-arrays';

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
