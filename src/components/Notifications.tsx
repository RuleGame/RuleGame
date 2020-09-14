import React from 'react';
import { useSelector } from 'react-redux';
import Notification from './Notification';
import { notificationsIdsSelector } from '../store/selectors/notifications';

const Notifications: React.FunctionComponent = () => {
  const notificationsIds = useSelector(notificationsIdsSelector);

  return (
    <>
      {/* Disable Notifications in Cypress */}
      {window.Cypress === undefined &&
        notificationsIds.map((notificationsId) => (
          <Notification notificationId={notificationsId} key={notificationsId} />
        ))}
    </>
  );
};

export default Notifications;
