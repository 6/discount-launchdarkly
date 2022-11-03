import { useState } from 'react';
import { PageContainer } from 'components/page-container';
import { ProjectMenu } from 'components/project-menu';
import { EnvMenu } from 'components/env-menu';
import { DashboardFlagsList } from './dashboard-flags-list.component';
import { useListFlags } from 'hooks/use-list-flags';
import { useLaunchDarklyConfig } from 'hooks/use-launchdarkly-config';
import { DashboardCreateFlagMenu } from './dashboard-create-flag-menu.component';
import { Box } from '@chakra-ui/react';

export const DashboardScreen = () => {
  const { env, projectKey } = useLaunchDarklyConfig();
  const [includeArchived, setIncludeArchived] = useState<boolean>(false);
  const {
    loading,
    response: flags,
    refetch: refetchFlags,
  } = useListFlags({ env: env.key, projectKey, archived: includeArchived });

  return (
    <PageContainer>
      <ProjectMenu />
      <EnvMenu />
      <Box display={'inline-block'} style={{ float: 'right' }}>
        <DashboardCreateFlagMenu refetchFlags={refetchFlags} />
      </Box>
      <DashboardFlagsList
        loading={loading}
        flags={flags}
        refetchFlags={refetchFlags}
        includeArchived={includeArchived}
        setIncludeArchived={setIncludeArchived}
      />
    </PageContainer>
  );
};
