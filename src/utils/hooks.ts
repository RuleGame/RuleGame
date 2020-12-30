import { useLocalStorage, useSearchParam } from 'react-use';
import { useQuery } from 'react-query';
import { DEFAULT_WORKER_ID, LOCAL_STORAGE_KEY, SEARCH_QUERY_KEYS } from '../constants';
import { LocalStorageWorkerIdKey } from '../@types';
import { api, METHOD } from './api';
import { Color } from '../constants/Color';
import rgb from './rgb';

export const useWorkerId = () => {
  return useSearchParam(SEARCH_QUERY_KEYS.WORKER_ID) ?? DEFAULT_WORKER_ID;
};

export const useWorkerLocalStorage = () =>
  useLocalStorage<LocalStorageWorkerIdKey>(LOCAL_STORAGE_KEY.WORKER_ID, {
    seriesNo: undefined,
    savedRuleGuess: undefined,
  });

export const useExperimentPlan = () => useSearchParam(SEARCH_QUERY_KEYS.EXPERIMENT_PLAN) ?? '';

export const useColorRgb = (color: Color) => {
  const { data: colorMapping } = useQuery(`COLOR-MAPPING`, () =>
    api('/game-data/GameService2/colorMap', METHOD.GET, undefined, {}).then((response) => {
      if (response.data.error) {
        throw new Error(response.data.errmsg);
      }

      return response.data;
    }),
  );

  if (colorMapping) {
    const [r, g, b] = colorMapping[color];
    return rgb(r, g, b);
  }
};
