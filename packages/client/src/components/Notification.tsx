import React from 'react';
import { Dispatch } from 'redux';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Button, Heading, Layer } from 'grommet';
import { Close } from 'grommet-icons';
import { removeNotification } from '../store/actions/notifications';
import { RootAction } from '../store/actions';
import { notificationsByIdSelector } from '../store/selectors';
import { RootState } from '../store/reducers';
import { NotificationData } from '../@types/notifications';

const Notification: React.FunctionComponent<{
  notificationId: string;
}> = ({ notificationId }) => {
  const dispatch: Dispatch<RootAction> = useDispatch();
  const notification = useSelector<RootState, NotificationData>(
    (state) => notificationsByIdSelector(state)[notificationId],
  );

  const close = () => dispatch(removeNotification(notification.id));

  return (
    <Layer
      position="bottom"
      modal={false}
      margin={{ vertical: 'medium', horizontal: 'small' }}
      responsive={false}
      plain
    >
      <Box
        overflow="auto"
        align="center"
        direction="row"
        gap="small"
        justify="between"
        round="medium"
        elevation="medium"
        pad={{ vertical: 'xsmall', horizontal: 'large' }}
        background="status-ok"
      >
        <Heading level="3">{notification.title}</Heading>
        <Button icon={<Close size="medium" />} onClick={close} />
      </Box>
    </Layer>
  );
};

export default Notification;
