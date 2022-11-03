import { useLdGet, UseLdGetAPI } from 'hooks/use-ld-get';
import { SegmentItem } from './types';

export interface ListSegmentsResponse {
  items: Array<SegmentItem>;
}

interface UseSegmentsInterface {
  env: string | null;
  projectKey: string | null;
}
export const useListSegments = ({
  env,
  projectKey,
}: UseSegmentsInterface): UseLdGetAPI<ListSegmentsResponse> => {
  // https://apidocs.launchdarkly.com/tag/Segments#operation/getSegments
  //app.launchdarkly.com

  return useLdGet<ListSegmentsResponse>(
    {
      skip: !env || !projectKey, // Don't do request until env is loaded
      path: `/api/v2/segments/${projectKey}/${env}`,
      method: 'GET',
    },
    [projectKey, env],
  );
};
