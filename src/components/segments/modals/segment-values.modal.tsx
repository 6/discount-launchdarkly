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

export const SegmentValuesModal = ({
  values,
  isOpen,
  onCancel,
}: {
  values: Array<string>;
  isOpen: boolean;
  onCancel: () => void;
}) => {
  const prettyValues = useMemo(() => {
    return values.join('\n');
  }, [values]);
  const onClickCopy = useCallback(() => {
    navigator.clipboard.writeText(prettyValues);
  }, [prettyValues]);
  return (
    <Modal isOpen={isOpen} onClose={onCancel} size="full">
      <ModalOverlay />
      <ModalContent>
        <ModalCloseButton />
        <ModalBody>
          <ModalHeader>Segment Included/Excluded Values</ModalHeader>
          <Button rightIcon={<CopyIcon />} onClick={onClickCopy}>
            Copy to Clipboard
          </Button>
          <Code marginTop="4" whiteSpace={'pre'} display="block">
            {prettyValues}
          </Code>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
