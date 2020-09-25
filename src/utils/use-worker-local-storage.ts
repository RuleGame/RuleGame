import { useLocalStorage } from 'react-use';
import { LocalStorageWorkerIdKey } from '../@types';
import { LOCAL_STORAGE_KEY } from '../constants';

const useWorkerLocalStorage = () =>
  useLocalStorage<LocalStorageWorkerIdKey>(LOCAL_STORAGE_KEY.WORKER_ID, {
    seriesNo: undefined,
    savedRuleGuess: undefined,
  });

export default useWorkerLocalStorage;
