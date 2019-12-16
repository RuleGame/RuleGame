import React, { useCallback } from 'react';
import { Button } from 'grommet';
import { useDispatch } from 'react-redux';
import { Dispatch } from 'redux';

import { ActionButton as ActionButtonType } from '../@types';
import { RootAction } from '../store/actions';

const ActionButton: React.FunctionComponent<{ actionButton: ActionButtonType }> = ({
  actionButton,
}) => {
  const dispatch: Dispatch<RootAction> = useDispatch();
  const handleClick = useCallback(() => dispatch(actionButton.action), [dispatch, actionButton]);
  return <Button primary onClick={handleClick} label={actionButton.label} />;
};

export default ActionButton;
