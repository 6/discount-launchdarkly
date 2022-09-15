import { Center, Container, Heading, Text } from '@chakra-ui/react';
import { ColorModeToggle } from 'components/color-mode-toggle';

export const PageContainer = ({ children }: React.PropsWithChildren) => {
  return (
    <Container maxW="900px" paddingTop="5" paddingBottom="10">
      <ColorModeToggle />
      <Heading paddingTop="3" fontSize="3xl" textAlign="center">
        launchdarkly scuffed
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
          use launchdarkly via api token 🤐
        </Text>
      </Center>
      {children}
    </Container>
  );
};
