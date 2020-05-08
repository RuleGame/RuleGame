import React, { useCallback } from 'react';
import { Button } from 'grommet';
import { useDispatch } from 'react-redux';
import { Dispatch } from 'redux';

import { ActionButton as ActionButtonType } from '../@types';
import { RootAction } from '../store/actions';

const ActionButton: React.FunctionComponent<{
  actionButton: ActionButtonType;
  layerId: string;
}> = ({ actionButton, layerId }) => {
  const dispatch: Dispatch<RootAction> = useDispatch();
  const handleClick = useCallback(() => {
    let { action: actions } = actionButton;
    if (!Array.isArray(actions)) {
      actions = [actions];
    }
    actions.map((action) => dispatch(typeof action === 'function' ? action(layerId) : action));
  }, [actionButton, dispatch, layerId]);
  return <Button primary onClick={handleClick} label={actionButton.label} />;
};

export default ActionButton;
