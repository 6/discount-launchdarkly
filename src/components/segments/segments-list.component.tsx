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
import { ListSegmentsResponse } from 'hooks/use-list-segments';
import lodash from 'lodash';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { SegmentListItem } from './segment-list-item.component';

const PER_PAGE = 25;

interface SegmentsListInterface {
  loading: boolean;
  segments: ListSegmentsResponse | null;
}
export const SegmentsList = ({ loading, segments }: SegmentsListInterface) => {
  const containerBg = useColorModeValue('white', 'gray.900');
  const containerBorderColor = useColorModeValue('gray.200', 'gray.700');
  const [includeDeleted, setIncludeDeleted] = useState<boolean>(false);
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

  const filteredSegments = useMemo(() => {
    if (!segments?.items?.length) {
      return [];
    }
    let filteredSegments = segments.items.filter((segment) => {
      return segment.deleted === includeDeleted;
    });
    const normalizedFilter = (debouncedFilter ?? '').trim().toLocaleLowerCase();
    if (normalizedFilter.length > 2) {
      filteredSegments = filteredSegments.filter((segment) => {
        return (
          segment.key.includes(normalizedFilter) ||
          segment.name.toLocaleLowerCase().includes(normalizedFilter) ||
          lodash.find(segment.tags ?? [], (tag) =>
            tag.toLocaleLowerCase().includes(normalizedFilter),
          ) ||
          segment.included.includes(normalizedFilter) ||
          segment.excluded.includes(normalizedFilter)
        );
      });
    }
    return lodash.orderBy(filteredSegments, 'creationDate', 'desc');
  }, [segments, debouncedFilter, page, includeDeleted]);

  const paginatedSegments = useMemo(() => {
    const pageStart = page * PER_PAGE;
    const pageEnd = pageStart + PER_PAGE;
    return filteredSegments.slice(pageStart, pageEnd);
  }, [filteredSegments]);

  const onChangeFilter = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setFilter(e.target.value);
  }, []);

  const memoizedSegmentItems = useMemo(() => {
    if (!paginatedSegments?.length) {
      return <Center>No segments found!</Center>;
    }
    return paginatedSegments.map((segment, i, { length }) => {
      const isLastItem = i + 1 === length;
      return (
        <SegmentListItem
          key={segment.key}
          segment={segment}
          setFilter={setFilter}
          isLastItem={isLastItem}
        />
      );
    });
  }, [paginatedSegments]);

  const normalizedPage = useMemo(() => {
    const first = page * PER_PAGE + 1;
    const last = first + paginatedSegments.length - 1;
    const totalSegments = filteredSegments.length;
    const isFirstPage = page === 0;
    const isLastPage = !totalSegments || last >= totalSegments;
    return { first, last, totalSegments, isFirstPage, isLastPage };
  }, [page, paginatedSegments, filteredSegments]);

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
                placeholder="Filter segments"
                value={filter}
                onChange={onChangeFilter}
                borderColor="gray.500"
              />
              <InputRightElement
                children={
                  <Tooltip
                    label="Filter by segment name, tag, or included/excluded value"
                    fontSize="md"
                  >
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
                value={includeDeleted ? 'deleted' : 'active'}
                title="Show only"
                type="radio"
              >
                <MenuItemOption value="active" onClick={() => setIncludeDeleted(false)}>
                  Active segments
                </MenuItemOption>
                <MenuItemOption value="deleted" onClick={() => setIncludeDeleted(true)}>
                  Deleted segments
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
          {normalizedPage.totalSegments && (
            <Text align="right">
              Showing{' '}
              <b>
                {normalizedPage.first}-{normalizedPage.last}
              </b>{' '}
              of {normalizedPage.totalSegments} segments
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
        {memoizedSegmentItems}
      </Box>
    </Box>
  );
};
