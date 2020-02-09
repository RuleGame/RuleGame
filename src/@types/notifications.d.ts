import { RootAction } from '../store/actions';

export type NotificationData = {
  id: string;
  title: string;
  actionButtons: { key: string; label: string; action: RootAction | RootAction[] }[];
};
