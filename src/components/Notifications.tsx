import React from 'react';
import { useSelector } from 'react-redux';
import { notificationsIdsSelector } from '../store/selectors';
import Notification from './Notification';

const Notifications: React.FunctionComponent = () => {
  const notificationsIds = useSelector(notificationsIdsSelector);

  return (
    <>
      {notificationsIds.map((notificationsId) => (
        <Notification notificationId={notificationsId} key={notificationsId} />
      ))}
    </>
  );
};

export default Notifications;