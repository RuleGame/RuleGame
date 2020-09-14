import { RootState } from '../reducers';

export const notificationsByIdSelector = (state: RootState) => state.notifications.byId;

export const notificationsIdsSelector = (state: RootState) => state.notifications.ids;
