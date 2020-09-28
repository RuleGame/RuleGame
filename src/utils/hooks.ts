import { useLocalStorage, useSearchParam } from 'react-use';
import { DEFAULT_WORKER_ID, LOCAL_STORAGE_KEY, SEARCH_QUERY_KEYS } from '../constants';
import { LocalStorageWorkerIdKey } from '../@types';

export const useWorkerId = () => {
  return useSearchParam(SEARCH_QUERY_KEYS.WORKER_ID) ?? DEFAULT_WORKER_ID;
};

export const useWorkerLocalStorage = () =>
  useLocalStorage<LocalStorageWorkerIdKey>(LOCAL_STORAGE_KEY.WORKER_ID, {
    seriesNo: undefined,
    savedRuleGuess: undefined,
  });

export const useExperimentPlan = () => useSearchParam(SEARCH_QUERY_KEYS.EXPERIMENT_PLAN) ?? '';
