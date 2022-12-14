import { useCallback, useMemo } from 'react';
import moment from 'moment';
import { ChevronDownIcon, CopyIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  HStack,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Stack,
  Tag,
  Text,
  Tooltip,
  useColorModeValue,
  useDisclosure,
} from '@chakra-ui/react';
import { SegmentItem } from 'hooks/use-list-segments/types';
import { SegmentDebugModal, SegmentValuesModal } from './modals';

interface SegmentListItemInterface {
  segment: SegmentItem;
  setFilter: (newFilter: string) => void;
  isLastItem: boolean;
}
export const SegmentListItem = ({ segment, setFilter, isLastItem }: SegmentListItemInterface) => {
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const {
    onOpen: openSegmentDebug,
    isOpen: isOpenSegmentDebug,
    onClose: onCloseSegmentDebug,
  } = useDisclosure();
  const {
    onOpen: openSegmentIncluded,
    isOpen: isOpenSegmentIncluded,
    onClose: onCloseSegmentIncluded,
  } = useDisclosure();
  const {
    onOpen: openSegmentExcluded,
    isOpen: isOpenSegmentExcluded,
    onClose: onCloseSegmentExcluded,
  } = useDisclosure();

  const { creationDateFormatted, creationDateRelative } = useMemo(() => {
    const creationDateMoment = moment(segment.creationDate);
    return {
      creationDateFormatted: creationDateMoment.format(),
      creationDateRelative: creationDateMoment.fromNow(),
    };
  }, [segment.creationDate]);

  const copyKeyOnClick = useCallback(() => {
    navigator.clipboard.writeText(segment.key);
  }, [segment.key]);

  const included = useMemo(() => {
    return (segment.included ?? []).sort();
  }, [segment.included]);

  const excluded = useMemo(() => {
    return (segment.excluded ?? []).sort();
  }, [segment.excluded]);

  const isEmpty = !included.length && !excluded.length;

  return (
    <Stack
      direction="row"
      borderBottom={isLastItem ? '0px' : '1px'}
      borderColor={borderColor}
      paddingBottom="3"
      paddingTop="3"
    >
      <SegmentDebugModal
        segment={segment}
        isOpen={isOpenSegmentDebug}
        onCancel={onCloseSegmentDebug}
      />
      <SegmentValuesModal
        values={included}
        isOpen={isOpenSegmentIncluded}
        onCancel={onCloseSegmentIncluded}
      />
      <SegmentValuesModal
        values={excluded}
        isOpen={isOpenSegmentExcluded}
        onCancel={onCloseSegmentExcluded}
      />
      <Box flex={5}>
        <HStack>
          <Text fontSize="md" as="b">
            {segment.name}
          </Text>
          <Tooltip label={creationDateFormatted}>
            <Text fontSize="xs" color="gray">
              Created {creationDateRelative}
            </Text>
          </Tooltip>
        </HStack>
        <Button marginTop="1" colorScheme="gray" size="xs" onClick={copyKeyOnClick}>
          {segment.key}
          <CopyIcon marginLeft="2" />
        </Button>
        {segment.tags?.length ? (
          <Box marginTop="1">
            {segment.tags.map((tag) => {
              return (
                <Tag
                  size="sm"
                  variant="outline"
                  marginRight="2"
                  key={`${segment.key}-${tag}`}
                  onClick={() => setFilter(tag)}
                  cursor="pointer"
                >
                  {tag}
                </Tag>
              );
            })}
          </Box>
        ) : (
          <></>
        )}
        {isEmpty ? (
          <Box marginTop="2" flex={1}>
            This is an empty segment (no included/excluded users).
          </Box>
        ) : (
          <></>
        )}
        {included.length ? (
          <Box marginTop="2" flex={1}>
            Included ({included.length} users):
            <Tag size="sm" marginRight="1">
              {included[0]}
            </Tag>
            {included.length > 2 && (
              <Tag size="sm" marginRight="1">
                ...
              </Tag>
            )}
            {included.length > 1 && <Tag size="sm">{included[included.length - 1]}</Tag>}
          </Box>
        ) : (
          <></>
        )}
        {excluded.length ? (
          <Box marginTop="2" flex={1}>
            Excluded ({excluded.length} users):
            <Tag size="sm" marginRight="1">
              {excluded[0]}
            </Tag>
            {excluded.length > 2 && (
              <Tag size="sm" marginRight="1">
                ...
              </Tag>
            )}
            {excluded.length > 1 && <Tag size="sm">{excluded[excluded.length - 1]}</Tag>}
          </Box>
        ) : (
          <></>
        )}
      </Box>
      <HStack flex={2} justifyContent="right">
        <Box paddingLeft="2">
          <Menu>
            <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
              Actions
            </MenuButton>
            <MenuList>
              {isEmpty ? (
                <></>
              ) : (
                <>
                  {included.length > 0 && (
                    <MenuItem onClick={openSegmentIncluded}>View all included users</MenuItem>
                  )}
                  {excluded.length > 0 && (
                    <MenuItem onClick={openSegmentExcluded}>View all excluded users</MenuItem>
                  )}
                  <MenuDivider />
                  <MenuItem onClick={openSegmentDebug}>Segment debugger</MenuItem>
                </>
              )}
              {/* <MenuItem onClick={openUpdateFlagGlobals}>Edit settings</MenuItem>
              <MenuItem onClick={openUpdateFlagIndividualTargets}>Edit individual targets</MenuItem>
              <MenuItem onClick={openUpdateFlagDefaults}>Edit default rules</MenuItem>
              <MenuDivider />
              <MenuDivider />
              {flag.archived ? (
                <MenuItem color="red" onClick={onUnarchived}>
                  Unarchive flag
                </MenuItem>
              ) : (
                <MenuItem color="red" onClick={onArchived}>
                  Archive flag
                </MenuItem>
              )} */}
            </MenuList>
          </Menu>
        </Box>
      </HStack>
    </Stack>
  );
};
