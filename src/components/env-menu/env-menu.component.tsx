import { ChevronDownIcon } from '@chakra-ui/icons';
import { Box, Button, Menu, MenuButton, MenuItem, MenuList } from '@chakra-ui/react';
import { useLaunchDarklyConfig } from 'hooks/use-launchdarkly-config';

export const EnvMenu = () => {
  const { env, envs, setEnv } = useLaunchDarklyConfig();

  return (
    <Menu>
      <MenuButton as={Button} rightIcon={<ChevronDownIcon />} marginRight="2">
        <Box width="2" height="2" bg={`#${env.color}`} display="inline-block" marginRight="2" />
        Env: {env.name}
      </MenuButton>
      <MenuList>
        {envs.items.map((envOption, i) => {
          return (
            <MenuItem minH="48px" key={i} onClick={() => setEnv(envOption)}>
              <Box
                width="2"
                height="2"
                bg={`#${envOption.color}`}
                display="inline-block"
                marginRight="2"
              />
              <span>{envOption.name}</span>
            </MenuItem>
          );
        })}
      </MenuList>
    </Menu>
  );
};
