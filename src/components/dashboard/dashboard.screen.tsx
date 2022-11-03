import { PageContainer } from 'components/page-container';
import { ProjectMenu } from 'components/project-menu';
import { EnvMenu } from 'components/env-menu';
import { DashboardFlagsList } from './dashboard-flags-list.component';
import { useListFlags } from 'hooks/use-list-flags';
import { useLaunchDarklyConfig } from 'hooks/use-launchdarkly-config';
import { DashboardCreateFlagMenu } from './dashboard-create-flag-menu.component';
import { useState } from 'react';
import {
  Box,
  IconButton,
  Menu,
  MenuButton,
  MenuItemOption,
  MenuList,
  MenuOptionGroup,
} from '@chakra-ui/react';
import { SettingsIcon } from '@chakra-ui/icons';

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
      <Menu>
        <MenuButton
          as={IconButton}
          aria-label="Filter Settings"
          icon={<SettingsIcon />}
          marginRight="3"
        />
        <MenuList>
          <MenuOptionGroup
            value={includeArchived ? 'archived' : 'unarchived'}
            title="Show only"
            type="radio"
          >
            <MenuItemOption value="unarchived" onClick={() => setIncludeArchived(false)}>
              Unarchived flags
            </MenuItemOption>
            <MenuItemOption value="archived" onClick={() => setIncludeArchived(true)}>
              Archived flags
            </MenuItemOption>
          </MenuOptionGroup>
        </MenuList>
      </Menu>
      <Box display={'inline-block'} style={{ float: 'right' }}>
        <DashboardCreateFlagMenu refetchFlags={refetchFlags} />
      </Box>
      <DashboardFlagsList loading={loading} flags={flags} refetchFlags={refetchFlags} />
    </PageContainer>
  );
};
