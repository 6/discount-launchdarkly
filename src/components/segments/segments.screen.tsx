import { useState } from 'react';
import { PageContainer } from 'components/page-container';
import { ListSegmentsResponse, useListSegments } from 'hooks/use-list-segments';
import { useLaunchDarklyConfig } from 'hooks/use-launchdarkly-config';
import { Box, Center, Spinner } from '@chakra-ui/react';
import { EnvMenu } from 'components/env-menu';
import { ProjectMenu } from 'components/project-menu';
import { SegmentsList } from './segments-list.component';

export const SegmentsScreen = () => {
  const { env, projectKey } = useLaunchDarklyConfig();
  const [includeDeleted, setIncludeDeleted] = useState<boolean>(false);
  const { loading, response: segments } = useListSegments({ env: env.key, projectKey });

  return (
    <PageContainer>
      <ProjectMenu />
      <EnvMenu />
      <SegmentsList loading={loading} segments={segments} />
    </PageContainer>
  );
};
