import {
  Box,
  Flex,
  HStack,
  IconButton,
  SlideFade,
  useDisclosure,
} from '@chakra-ui/react';
import { searchMembers, sendMessage, Snowflake } from '@omagize/api';
import { RefObject, useRef, useState } from 'react';
import Card from '../../../../components/card/Card';
import { FiFile, FiSend } from 'react-icons/fi';
import { GrEmoji } from 'react-icons/gr';
import { useMutation, useQuery } from '@tanstack/react-query';
import useFilePicker from 'components/picker/FilePicker';
import { FileUploadItem } from './FileUploadItem';
import { CustomCardProps } from 'theme/theme';
import MessageInput, { ValueProps } from 'components/editor/MessageInput';
import { convertToRaw, EditorState } from 'draft-js';
import draftToMarkdown from 'utils/markdown/draftToMarkdown';
import { Toolbar } from '../../../../components/editor/Toolbar';
import { BsThreeDots } from 'react-icons/bs';
import { createDefault } from 'components/editor/TextEditor';

export type MessageOptions = {
  message: EditorState;
  attachments: File[];
};
function useOptionState() {
  const [content, setContent] = useState<MessageOptions>(() => ({
    message: createDefault(),
    attachments: [],
  }));

  return {
    content,
    setContent,
    resetContent: () =>
      setContent({
        attachments: [],
        message: createDefault(),
      }),
    dispatch: (v: (prev: MessageOptions) => Partial<MessageOptions>) => {
      return setContent((prev) => ({ ...prev, ...v(prev) }));
    },
  };
}
export function MessageBar({
  group,
  messageBar,
}: {
  group: Snowflake;
  messageBar?: CustomCardProps;
}) {
  const suggestionRef = useRef<HTMLDivElement>();
  const { content, resetContent, dispatch } = useOptionState();
  const { isOpen: showToolbar, onToggle: toggleToolbar } = useDisclosure();
  const sendMutation = useSendMutation(group);
  const picker = useFilePicker((f) =>
    dispatch((prev) => ({
      attachments: [...prev.attachments, f],
    }))
  );

  const send = () => {
    sendMutation.mutate(content);
    resetContent();
  };

  const canSend =
    (content.attachments.length !== 0 || !content.message.isEmpty) &&
    !sendMutation.isLoading;

  return (
    <Flex pos="relative" direction="column" w="full" gap={2}>
      <Attachments
        value={content.attachments}
        onRemove={(f) =>
          dispatch((prev) => ({
            attachments: prev.attachments.filter((file) => file !== f),
          }))
        }
      />
      <Box ref={suggestionRef} />
      <Box pos="absolute" top="-30%">
        <SlideFade in={showToolbar}>
          <Toolbar
            value={content.message}
            onChange={(m) => dispatch(() => ({ message: m }))}
          />
        </SlideFade>
      </Box>

      <Card
        flexDirection="row"
        alignItems="center"
        gap={2}
        px={{ base: 2, md: '20px' }}
        {...messageBar}
      >
        {picker.component}
        <IconButton
          aria-label="add-file"
          icon={<FiFile />}
          onClick={picker.pick}
        />
        <IconButton aria-label="add-emoji" icon={<GrEmoji />} />
        <IconButton
          icon={<BsThreeDots />}
          onClick={toggleToolbar}
          aria-label="style"
        />
        <Input
          group={group}
          suggestionRef={suggestionRef}
          value={content.message}
          onChange={(v) =>
            dispatch(() => ({
              message: v,
            }))
          }
        />
        <IconButton
          onClick={send}
          isLoading={sendMutation.isLoading}
          disabled={!canSend}
          variant="brand"
          aria-label="send"
          icon={<FiSend />}
        />
      </Card>
    </Flex>
  );
}

function Input({
  value,
  onChange,
  group,
  suggestionRef,
}: ValueProps & {
  group: Snowflake;
  suggestionRef: RefObject<HTMLDivElement>;
}) {
  const [search, setSearch] = useState<string | null>(null);
  const query = useQuery(
    ['search_member', group, search],
    () => searchMembers(group, search, 10),
    {
      enabled: search != null,
    }
  );

  return (
    <MessageInput
      value={value}
      onChange={onChange}
      editor={{
        placeholder: 'Input your message here...',
      }}
      mentionSuggestions={{
        portal: suggestionRef,
        onSearch: setSearch,
        suggestions: query.data?.map((member) => ({
          id: member.id,
          name: member.username,
          avatar: member.avatarUrl,
        })),
      }}
    />
  );
}

function Attachments(props: {
  value: File[];
  onRemove: (remove: File) => void;
}) {
  const { value, onRemove } = props;

  return (
    <HStack w="full" overflow="auto">
      {value.map((a, i) => (
        <FileUploadItem
          key={`${i}-${a.webkitRelativePath}`}
          file={a}
          onRemove={() => onRemove(a)}
          card={{
            flexShrink: 0,
          }}
        />
      ))}
    </HStack>
  );
}

function useSendMutation(group: Snowflake) {
  return useMutation(
    ['send_message', group],
    async (content: MessageOptions) => {
      const raw = convertToRaw(content.message.getCurrentContent());
      const markdown = draftToMarkdown(raw);

      return await sendMessage(group, markdown, content.attachments);
    }
  );
}
