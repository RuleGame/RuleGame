import { RootAction } from '../store/actions';

export type LayerData = {
  id: string;
  title: string;
  description: React.Node;
  actionButtons: { key: string; label: string; action: RootAction | RootAction[] }[];
  closeOnEsc: boolean;
  closeOnClickOutside: boolean;
};
