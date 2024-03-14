import { useMemo } from 'react';
import { QueryResult, useQuery } from 'react-query';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { useLocalStorage, useSearchParam } from 'react-use';
import sanitizeHtml, { defaults } from 'sanitize-html';
import { LocalStorageWorkerIdKey } from '../@types';
import { LOCAL_STORAGE_KEY, SearchQueryKey } from '../constants';
import { Color } from '../constants/Color';
import { addLayer } from '../store/actions/layers';
import { Endpoints, METHOD, api } from './api';
import rgb from './rgb';
import { RootState } from '../store/reducers';
import { AppDispatch } from '../store/configureStore';

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

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export function usePregameService<
  T extends '/game-data/PregameService/getBookletSize' | '/game-data/PregameService/getPage'
>(
  url: T,
  queryParams: Omit<Endpoints[T][METHOD.GET]['query'], 'playerId'>,
): QueryResult<Endpoints[T][METHOD.GET]['resBody'] & { workerId: string }, Error> {
  const dispatch = useAppDispatch();
  const uid = useSearchParam(SearchQueryKey.UID) ?? undefined;
  const workerIdSearchParam = useSearchParam(SearchQueryKey.WORKER_ID) ?? undefined;
  const exp = useExperimentPlan();

  const query = useQuery(
    `${workerIdSearchParam}-${url}-${JSON.stringify(queryParams)}`,
    async () => {
      const {
        data: { error, errmsg, playerId },
      } = await api(
        '/game-data/GameService2/player',
        METHOD.POST,
        {
          ...(workerIdSearchParam && { playerId: workerIdSearchParam }),
          ...(uid && { uid: Number(uid) }),
          exp,
        },
        {},
      );
      if (error) {
        throw Error(errmsg);
      }

      const urlData = (
        await api(url, METHOD.GET, undefined, {
          ...queryParams,
          playerId,
        })
      ).data;

      if (urlData.error) {
        throw Error(urlData.errmsg);
      }

      return { workerId: playerId, ...urlData };
    },
    {
      retry: false,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      onError: (e: Error) => {
        dispatch(addLayer('An Error Ocurred', e.message, []));
        throw e;
      },
    },
  );

  return query;
}

export const usePregameServiceGetPage = (name: string) =>
  usePregameService('/game-data/PregameService/getPage', { name });

// export const usePregameServiceGetPageWithSanitizedHtml = (name: string) => {
//   const queryResult = usePregameService('/game-data/PregameService/getPage', { name });

//   const processedQueryResult = useMemo(() => {
//     if (queryResult.data !== undefined) {
//       return {
//         ...queryResult,
//         data: { ...queryResult.data, value: sanitizeHtml(queryResult.data.value) },
//       };
//     }
//     return queryResult;
//   }, [queryResult]);

//   return processedQueryResult;
// };

// export const usePregameServiceGetPageWithSanitizedHtml = (
//   name: string,
//   // Passing different replaceStrings object references is computationally heavy when this is called.
//   // Try calling useMemo before passing an object here.
//   replaceStrings?: { [k: string]: string },
// ) => {
//   const queryResult = usePregameService('/game-data/PregameService/getPage', { name });

//   const processedQueryResult = useMemo(() => {
//     if (queryResult.data?.value !== undefined) {
//       let processedHtml = sanitizeHtml(queryResult.data.value);
//       if (replaceStrings) {
//         processedHtml = Object.entries(replaceStrings).reduce(
//           (acc, [key, value]) => acc.replaceAll(`{${key}}`, value),
//           processedHtml,
//         );
//       }
//       // return {
//       //   ...queryResult,
//       //   data: { ...queryResult.data, value: processedHtml },
//       // };
//       queryResult.data.value = processedHtml;
//     }
//     return queryResult;
//   }, [queryResult.data.value, replaceStrings]);

//   return processedQueryResult;
// };

// export const usePregameServiceGetPageWithSanitizedHtml = (
//   name: string,
//   // Passing different replaceStrings object references is computationally heavy when this is called.
//   // Try calling useMemo before passing an object
//   replaceStrings?: { [k: string]: string },
// ) => {
//   const queryResult = usePregameService('/game-data/PregameService/getPage', { name });

//   const processedQueryResult = useMemo(() => {
//     if (queryResult.data !== undefined) {
//       let processedHtml = sanitizeHtml(queryResult.data.value);
//       if (replaceStrings) {
//         processedHtml = Object.entries(replaceStrings).reduce(
//           (acc, [key, value]) => acc.replaceAll(`{${key}}`, value),
//           processedHtml,
//         );
//       }
//       return {
//         ...queryResult,
//         data: { ...queryResult.data, value: processedHtml },
//       };
//     }
//     return queryResult;
//   }, [queryResult, replaceStrings]);

//   return processedQueryResult;
// };

// export const usePregameServiceGetPageWithSanitizedHtml = (
//   name: string,
//   replaceStrings: { [k: string]: string } = {}, // Don't expect this to change
// ) => {
//   const queryResult = usePregameService('/game-data/PregameService/getPage', { name });

//   const processedQueryResult = useMemo<typeof queryResult>(() => {
//     const { data } = queryResult;
//     if (data !== undefined) {
//       const sanitizedHtml = sanitizeHtml(data.value);
//       const replacedStringsHtml = Object.entries(replaceStrings).reduce(
//         (acc, [key, value]) => acc.replaceAll(`{${key}}`, value),
//         sanitizedHtml,
//       );

//       const newQueryResult: typeof queryResult = Object.queryResult };
//       newQueryResult.data = { ... queryResult.data };

//       return { ...queryResult, data: { ...queryResult.data, value: replacedStringsHtml } };
//     }
//     return queryResult;
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [queryResult]);

//   return processedQueryResult;
// };

export const useSanitizedHtml = (value?: string) =>
  useMemo(() => {
    if (value !== undefined) {
      return sanitizeHtml(value, { allowedTags: [...defaults.allowedTags, 'button'] });
    }
  }, [value]);

export const useReplaceString = (
  value: string | undefined,
  replaceString: string,
  replaceValue: string,
) =>
  useMemo(() => {
    if (value !== undefined) {
      return value.replace(new RegExp(`{${replaceString}}`, 'g'), replaceValue);
    }
  }, [replaceString, replaceValue, value]);
