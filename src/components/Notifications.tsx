import React from 'react';
import { Dispatch } from 'redux';
import { useDispatch } from 'react-redux';
import { Box, Heading, Layer } from 'grommet';
import { NotificationData } from '../@types/notifications';
import { removeNotification } from '../store/actions/notifications';
import { RootAction } from '../store/actions';
import ActionButton from './ActionButton';

const Notifications: React.FunctionComponent<{
  notifications: NotificationData[];
}> = ({ notifications }) => {
  const dispatch: Dispatch<RootAction> = useDispatch();
  const closeLayer = (id: string) => () => dispatch(removeNotification(id));

  return (
    <>
      {notifications.map((notification) => (
        <Layer
          key={notification.id}
          position="bottom"
          modal={false}
          margin={{ vertical: 'medium', horizontal: 'small' }}
          onEsc={closeLayer(notification.id)}
          onClickOutside={closeLayer(notification.id)}
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
            pad={{ vertical: 'xsmall', horizontal: 'small' }}
            background="status-ok"
          >
            <Heading level="3">{notification.title}</Heading>
            <div>
              {notification.actionButtons.map((actionButton) => (
                <ActionButton actionButton={actionButton} key={actionButton.key} />
              ))}
            </div>
          </Box>
        </Layer>
      ))}
    </>
  );
};

export default Notifications;
