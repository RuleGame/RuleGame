import { RootAction } from '../store/actions';

export type LayerData = {
  id: string;
  title: React.Node;
  description: React.Node;
  actionButtons: {
    key: string;
    label: string;
    action:
      | ((id: string) => RootAction)
      | RootAction
      | (RootAction | ((id: string) => RootAction))[];
  }[];
  closeOnEsc: boolean;
  closeOnClickOutside: boolean;
  dataCyIdentifier?: string;
};
