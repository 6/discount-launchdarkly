import { useNavigate } from 'react-router-dom';
import { Button, Center, Container, Heading, HStack, Text, Tooltip } from '@chakra-ui/react';
import { ColorModeToggle } from 'components/color-mode-toggle';
import { useLaunchDarklyConfig } from 'hooks/use-launchdarkly-config';

export const PageContainer = ({ children }: React.PropsWithChildren) => {
  const navigate = useNavigate();
  const { accessToken } = useLaunchDarklyConfig();

  return (
    <Container maxW="1100px" paddingTop="5" paddingBottom="10">
      <HStack>
        <ColorModeToggle />
        {accessToken && (
          <Tooltip
            label={`Your current API token has the ${accessToken.role} role. 'writer' role is required to make create and modify flags.`}
          >
            <Button>Role: {accessToken.role}</Button>
          </Tooltip>
        )}
      </HStack>
      <Heading paddingTop="3" fontSize="3xl" textAlign="center">
        <span style={{ cursor: 'pointer' }} onClick={() => navigate('/')}>
          Discount LaunchDarkly 🤨
        </span>
      </Heading>
      <Center>
        <Text
          marginTop="5"
          marginBottom="7"
          fontSize="xl"
          textAlign="center"
          maxW="md"
          alignSelf="center"
        >
          Use LaunchDarkly via API token.
        </Text>
      </Center>
      {children}
    </Container>
  );
};
