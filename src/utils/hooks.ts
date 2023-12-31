import { useQuery } from 'react-query';
import { useLocalStorage, useSearchParam } from 'react-use';
import { LocalStorageWorkerIdKey } from '../@types';
import { LOCAL_STORAGE_KEY, SearchQueryKey } from '../constants';
import { Color } from '../constants/Color';
import { api, METHOD } from './api';
import rgb from './rgb';

export const useWorkerLocalStorage = () =>
  useLocalStorage<LocalStorageWorkerIdKey>(LOCAL_STORAGE_KEY.WORKER_ID, {
    seriesNo: undefined,
    savedRuleGuess: undefined,
  });

export const useExperimentPlan = () => useSearchParam(SearchQueryKey.EXPERIMENT_PLAN) ?? '';

export const useColorRgb = (color?: Color) => {
  const { data: colorMapping } = useQuery(`COLOR-MAPPING`, () =>
    api('/game-data/GameService2/colorMap', METHOD.GET, undefined, {}).then((response) => {
      if (response.data.error) {
        throw new Error(response.data.errmsg);
      }

      return response.data;
    }),
  );

  if (colorMapping && color) {
    const [r, g, b] = colorMapping[color];
    return rgb(r, g, b);
  }
};
