import { useLdGet, UseLdGetAPI } from 'hooks/use-ld-get';

export interface EnvironmentItem {
  _id: string; // "57be1db38b75bf0772d11384",
  key: string; // "my-environment",
  name: string; // "My Environment",
  apiKey: string; // "XYZ",
  mobileKey: string; // "XYZ",
  color: string; // "F5A623",
  defaultTtl: number; // 5,
  secureMode: boolean; // true,
  defaultTrackEvents: boolean; // false,
  requireComments: boolean; // true,
  confirmChanges: boolean; // true,
  tags: Array<string>;
  approvalSettings: {
    required: boolean; // true,
    bypassApprovalsForPendingChanges: boolean; // false,
    minNumApprovals: number; // 1,
    canReviewOwnRequest: boolean; // false,
    canApplyDeclinedChanges: boolean; // true,
    serviceKind: string; // "launchdarkly",
    serviceConfig: unknown; // {},
    requiredApprovalTags: Array<string>;
  };
}
export interface ListEnvironmentsResponse {
  totalCount: number;
  items: Array<EnvironmentItem>;
}

interface UseListEnvironmentsInterface {
  projectKey?: string;
}
export const useListEnvironments = ({
  projectKey,
}: UseListEnvironmentsInterface): UseLdGetAPI<ListEnvironmentsResponse> => {
  // https://apidocs.launchdarkly.com/tag/Environments#operation/getEnvironmentsByProject
  return useLdGet<ListEnvironmentsResponse>(
    {
      skip: !projectKey,
      path: `/api/v2/projects/${projectKey}/environments`,
      method: 'GET',
      query: {
        sort: 'name',
      },
    },
    [projectKey],
  );
};
