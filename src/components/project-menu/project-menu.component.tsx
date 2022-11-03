import { ChevronDownIcon } from '@chakra-ui/icons';
import { Button, Menu, MenuButton, MenuItem, MenuList } from '@chakra-ui/react';
import { useLaunchDarklyConfig } from 'hooks/use-launchdarkly-config';
import { useMemo } from 'react';
import lodash from 'lodash';

export const ProjectMenu = () => {
  const { projectKey, setProjectKey, projects } = useLaunchDarklyConfig();

  const sortedProjects = useMemo(() => {
    return lodash.orderBy(projects, 'key');
  }, [projects]);

  return (
    <Menu>
      <MenuButton as={Button} rightIcon={<ChevronDownIcon />} marginRight="2">
        Project: {projectKey}
      </MenuButton>
      <MenuList>
        {sortedProjects.map((project) => {
          return (
            <MenuItem minH="48px" key={project.key} onClick={() => setProjectKey(project.key)}>
              <span>
                {project.key} ({project.name})
              </span>
            </MenuItem>
          );
        })}
      </MenuList>
    </Menu>
  );
};
