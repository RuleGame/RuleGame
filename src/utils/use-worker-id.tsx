import { useSearchParam } from 'react-use';
import { DEFAULT_WORKER_ID, SEARCH_QUERY_KEYS } from '../constants';

const useWorkerId = () => {
  return useSearchParam(SEARCH_QUERY_KEYS.WORKER_ID) ?? DEFAULT_WORKER_ID;
};

export default useWorkerId;
