import {
  ChevronLeftIcon,
  ChevronRightIcon,
  QuestionOutlineIcon,
  SettingsIcon,
} from '@chakra-ui/icons';
import {
  Box,
  Center,
  HStack,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  Menu,
  MenuButton,
  MenuItemOption,
  MenuList,
  MenuOptionGroup,
  Spinner,
  Text,
  Tooltip,
  useColorModeValue,
} from '@chakra-ui/react';
import { ListFlagsResponse } from 'hooks/use-list-flags';
import lodash from 'lodash';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { DashboardFlagListItem } from './dashboard-flag-list-item.component';

const PER_PAGE = 100;

interface DashboardFlagsListInterface {
  loading: boolean;
  flags: ListFlagsResponse | null;
  refetchFlags: () => Promise<void>;
  includeArchived: boolean;
  setIncludeArchived: (includeArchived: boolean) => void;
}
export const DashboardFlagsList = ({
  loading,
  flags,
  refetchFlags,
  includeArchived,
  setIncludeArchived,
}: DashboardFlagsListInterface) => {
  const containerBg = useColorModeValue('white', 'gray.900');
  const containerBorderColor = useColorModeValue('gray.200', 'gray.700');
  const [filter, setFilter] = useState<string>('');
  const [debouncedFilter, setDebouncedFilter] = useState<string>('');
  const [page, setPage] = useState<number>(0);

  const debouncedFilterRef = useRef(
    lodash.debounce((filter) => {
      setPage(0);
      setDebouncedFilter(filter);
    }, 200),
  ).current;

  useEffect(() => {
    debouncedFilterRef(filter);
  }, [filter]);

  // console.log({ projectKey, loading, flags });

  const filteredFlags = useMemo(() => {
    if (!flags?.items?.length) {
      return [];
    }
    let filteredFlags = flags.items;
    const normalizedFilter = (debouncedFilter ?? '').trim().toLocaleLowerCase();
    if (normalizedFilter.length > 2) {
      filteredFlags = filteredFlags.filter((flag) => {
        const simpleMatch =
          flag.key.includes(normalizedFilter) ||
          flag.name.toLocaleLowerCase().includes(normalizedFilter) ||
          flag.description.toLocaleLowerCase().includes(normalizedFilter) ||
          lodash.find(flag.tags ?? [], (tag) => tag.toLocaleLowerCase().includes(normalizedFilter));
        if (simpleMatch) {
          return simpleMatch;
        }
        for (const env in flag.environments) {
          const flagEnv = flag.environments[env];
          for (const rule of flagEnv.rules || []) {
            return !!rule.clauses.find((clause) => clause.values.includes(normalizedFilter));
          }
        }
      });
    }
    return lodash.orderBy(filteredFlags, 'creationDate', 'desc');
  }, [flags, debouncedFilter, page]);

  const paginatedFlags = useMemo(() => {
    const pageStart = page * PER_PAGE;
    const pageEnd = pageStart + PER_PAGE;
    return filteredFlags.slice(pageStart, pageEnd);
  }, [filteredFlags]);

  const onChangeFilter = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setFilter(e.target.value);
  }, []);

  const memoizedFlagItems = useMemo(() => {
    if (!paginatedFlags?.length) {
      return <Center>No flags found!</Center>;
    }
    return paginatedFlags.map((flag, i, { length }) => {
      const isLastItem = i + 1 === length;
      return (
        <DashboardFlagListItem
          key={flag.key}
          flag={flag}
          setFilter={setFilter}
          isLastItem={isLastItem}
          refetchFlags={refetchFlags}
        />
      );
    });
  }, [paginatedFlags]);

  const normalizedPage = useMemo(() => {
    const first = page * PER_PAGE + 1;
    const last = first + paginatedFlags.length - 1;
    const totalFlags = filteredFlags.length;
    const isFirstPage = page === 0;
    const isLastPage = !totalFlags || last >= totalFlags;
    return { first, last, totalFlags, isFirstPage, isLastPage };
  }, [page, paginatedFlags, filteredFlags]);

  if (loading) {
    return (
      <Center minH="250" justifyContent={'center'}>
        <Spinner thickness="4px" speed="0.65s" emptyColor="gray.200" color="blue.500" size="xl" />
      </Center>
    );
  }

  return (
    <Box marginTop="4">
      <HStack flex={1} justifyContent="space-between">
        <HStack>
          <Box minW="450" maxW="450" justifyContent={'center'} flex="1">
            <InputGroup>
              <Input
                autoFocus
                placeholder="Filter flags"
                value={filter}
                onChange={onChangeFilter}
                borderColor="gray.500"
              />
              <InputRightElement
                children={
                  <Tooltip label="Filter by flag name, description, tag, or segment" fontSize="md">
                    <QuestionOutlineIcon />
                  </Tooltip>
                }
              />
            </InputGroup>
          </Box>
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
        </HStack>
        <HStack>
          <IconButton
            aria-label="Previous Page"
            icon={<ChevronLeftIcon />}
            disabled={normalizedPage.isFirstPage}
            onClick={() => setPage(page - 1)}
          />
          {normalizedPage.totalFlags && (
            <Text align="right">
              Showing{' '}
              <b>
                {normalizedPage.first}-{normalizedPage.last}
              </b>{' '}
              of {normalizedPage.totalFlags} flags
            </Text>
          )}
          <IconButton
            aria-label="Next Page"
            icon={<ChevronRightIcon />}
            onClick={() => setPage(page + 1)}
            disabled={normalizedPage.isLastPage}
          />
        </HStack>
      </HStack>
      <Box
        bg={containerBg}
        borderColor={containerBorderColor}
        borderWidth="1px"
        marginTop="4"
        paddingLeft="5"
        paddingRight="5"
        paddingTop="2"
        paddingBottom="2"
        borderRadius="md"
      >
        {memoizedFlagItems}
      </Box>
    </Box>
  );
};
