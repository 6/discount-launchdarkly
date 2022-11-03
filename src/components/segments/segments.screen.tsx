import { PageContainer } from 'components/page-container';
import { ListSegmentsResponse, useListSegments } from 'hooks/use-list-segments';
import { useLaunchDarklyConfig } from 'hooks/use-launchdarkly-config';
import { Box, Center, Spinner } from '@chakra-ui/react';
import { EnvMenu } from 'components/env-menu';
import { ProjectMenu } from 'components/project-menu';

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

const SegmentsList = ({
  loading,
  segments,
}: {
  loading: boolean;
  segments: ListSegmentsResponse | null;
}) => {
  if (loading) {
    return (
      <Center minH="250" justifyContent={'center'}>
        <Spinner thickness="4px" speed="0.65s" emptyColor="gray.200" color="blue.500" size="xl" />
      </Center>
    );
  }
  return <Box marginTop="4">{segments ? JSON.stringify(segments) : 'no segments'}</Box>;
};
