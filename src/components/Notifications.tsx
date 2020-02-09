import React from 'react';
import { Dispatch } from 'redux';
import { useDispatch } from 'react-redux';
import { Box, Button, Heading, Layer } from 'grommet';
import { Close } from 'grommet-icons';
import { NotificationData } from '../@types/notifications';
import { removeNotification } from '../store/actions/notifications';
import { RootAction } from '../store/actions';

const Notifications: React.FunctionComponent<{
  notifications: NotificationData[];
}> = ({ notifications }) => {
  const dispatch: Dispatch<RootAction> = useDispatch();

  return (
    <>
      {notifications.map((notification) => (
        <Layer
          key={notification.id}
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
            <Button
              icon={<Close size="medium" />}
              onClick={() => dispatch(removeNotification(notification.id))}
            />
          </Box>
        </Layer>
      ))}
    </>
  );
};

export default Notifications;
