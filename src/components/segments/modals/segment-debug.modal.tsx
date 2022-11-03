import { useCallback, useMemo } from 'react';
import { CopyIcon } from '@chakra-ui/icons';
import {
  Button,
  Code,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
} from '@chakra-ui/react';
import { SegmentItem } from 'hooks/use-list-segments/types';

export const SegmentDebugModal = ({
  segment,
  isOpen,
  onCancel,
}: {
  segment: SegmentItem;
  isOpen: boolean;
  onCancel: () => void;
}) => {
  const prettyJSON = useMemo(() => {
    return JSON.stringify(segment, null, 2);
  }, [segment]);
  const onClickCopy = useCallback(() => {
    navigator.clipboard.writeText(prettyJSON);
  }, [prettyJSON]);
  return (
    <Modal isOpen={isOpen} onClose={onCancel} size="full">
      <ModalOverlay />
      <ModalContent>
        <ModalCloseButton />
        <ModalBody>
          <ModalHeader>Debug Segment JSON</ModalHeader>
          <Button rightIcon={<CopyIcon />} onClick={onClickCopy}>
            Copy JSON to Clipboard
          </Button>
          <Code marginTop="4" whiteSpace={'pre'} display="block">
            {prettyJSON}
          </Code>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
