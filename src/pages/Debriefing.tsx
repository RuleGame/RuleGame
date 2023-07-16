import { Box } from 'grommet';
import { useQuery } from 'react-query';
import { useSearchParam } from 'react-use';
import GetPageHtml from '../components/GetPageHtml';
import { SearchQueryKey } from '../constants';
import { addLayer } from '../store/actions/layers';
import { workerIdSelector } from '../store/selectors/board';
import { api, METHOD } from '../utils/api';
import { useAppDispatch, useAppSelector, useExperimentPlan } from '../utils/hooks';

const Debriefing = () => {
  const workerId = useAppSelector(workerIdSelector);
  const exp = useExperimentPlan();
  const uid = useSearchParam(SearchQueryKey.UID) ?? undefined;
  const dispatch = useAppDispatch();

  const { data, isLoading } = useQuery(
    `${workerId}-DEBRIEFING`,
    () =>
      api(
        '/game-data/GameService2/player',
        METHOD.POST,
        {
          exp,
          ...(uid !== undefined && { uid: Number(uid) }),
          ...(workerId !== undefined && { playerId: workerId }),
        },
        {},
      ),
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
  const completionCode = isLoading ? '<loading...>' : data?.data.completionCode ?? '?';

  return (
    <Box direction="column" align="center" gap="medium" pad="medium">
      <Box align="center" elevation="large" fill>
        <GetPageHtml
          name={uid ? 'debriefing.uid.html' : 'debriefing.html'}
          replaceString="{completionCode}"
          replaceValue={completionCode}
        />
      </Box>
    </Box>
  );
};

export default Debriefing;
