// eslint-disable-next-line import/no-cycle
import { RootAction } from '../store/actions';

export type LayerData = {
  id: string;
  title: string;
  description: string;
  actionButtons: { key: string; label: string; action: RootAction }[];
};
