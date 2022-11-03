import { PageContainer } from 'components/page-container';
import { useListSegments } from 'hooks/use-list-segments';
import { useLaunchDarklyConfig } from 'hooks/use-launchdarkly-config';
import { EnvMenu } from 'components/env-menu';
import { ProjectMenu } from 'components/project-menu';
import { SegmentsList } from './segments-list.component';

export const SegmentsScreen = () => {
  const { env, projectKey } = useLaunchDarklyConfig();
  const { loading, response: segments } = useListSegments({ env: env.key, projectKey });

  return (
    <PageContainer>
      <ProjectMenu />
      <EnvMenu />
      <SegmentsList loading={loading} segments={segments} />
    </PageContainer>
  );
};
