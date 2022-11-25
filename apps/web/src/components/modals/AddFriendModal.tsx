import {
  Box,
  Button,
  Flex,
  FormControl,
  FormControlProps,
  FormErrorMessage,
  IconButton,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
} from '@chakra-ui/react';
import { useState } from 'react';
import { BiSend } from 'react-icons/bi';
import { useMutation } from '@tanstack/react-query';
import { sendFriendRequest, User, useSelfUser } from '@omagize/api';
import {
  useSearchUsernameQuery,
  useSearchUserIdQuery,
  ResultPlaceholder,
  SelectedUserItem,
} from '../panel/SearchUserPanel';
import { TabButton } from 'components/layout/Tab';
import { parseError } from 'utils/APIUtils';
import { useUserStore } from 'stores/UserStore';
import { SearchBar } from 'components/navbar/searchBar/SearchBar';
import { useColors } from 'variables/colors';
import { QueryStatus, QueryStatusLayout } from 'components/panel/QueryPanel';
import LoadingPanel from 'components/panel/LoadingPanel';

enum Tab {
  ByName = 0,
  ById = 1,
}

function useCheckSelected(selected: User | null): string | null {
  const self = useSelfUser();
  const [friends, friendRequests] = useUserStore((s) => [s.relations, s.friendRequests]);

  if (selected == null) return null;
  // prettier-ignore
  return self.id === selected.id? 'Why do you want to add yourself as a friend?' :
    friends?.some(f => f.user.id === selected.id)? 'He already is your friend' : 
    friendRequests?.some(f => f.user.id === selected.id)? 'Friend request had been sent' : null
}

export default function AddFriendModal({
  isOpen,
  onClose: closeModal,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [selected, setSelected] = useState<User>();
  const selectChecks = useCheckSelected(selected);
  const disable = selected == null || selectChecks != null;

  const onClose = () => {
    setSelected(null);
    closeModal();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered scrollBehavior="inside">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Send Friend Request</ModalHeader>
        <ModalCloseButton />
        <SearchPanel value={selected} onChange={setSelected} invalid={selectChecks != null} />
        <ModalFooter as={Flex} flexDirection="column" alignItems="stretch">
          {selected != null ? (
            <>
              <Text ml={2} fontWeight="bold">
                {selected.username}
              </Text>
              <MessageBar selected={selected} isDisabled={disable} error={selectChecks} />
            </>
          ) : (
            <Button onClick={onClose}>Close</Button>
          )}
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

function SearchPanel({
  value,
  onChange,
  invalid,
}: {
  value: User;
  onChange: (user: User) => void;
  invalid?: boolean;
}) {
  const [tab, setTab] = useState<Tab>(0);
  const [search, setSearch] = useState('');

  const nameQuery = useSearchUsernameQuery();
  const idQuery = useSearchUserIdQuery();

  const { cardBg } = useColors();

  const onSearch = () => {
    if (search.trim().length === 0) return;

    switch (tab) {
      case Tab.ByName: {
        nameQuery.setSearch(search);
        break;
      }
      case Tab.ById: {
        idQuery.setSearch(search);
        break;
      }
    }
  };

  const userItem = (user: User) => (
    <SelectedUserItem
      key={user.id}
      user={user}
      selected={user.id === value?.id}
      onClick={() => onChange(user)}
      invalid={invalid}
    />
  );

  return (
    <>
      <Box w="full" px={4}>
        <SearchBar
          w="full"
          onSearch={onSearch}
          input={{
            bg: cardBg,
            value: search,
            type: 'search',
            onChange: (e) => setSearch(e.target.value),
          }}
        />
      </Box>
      <ModalBody>
        <Tabs
          variant="soft-rounded"
          index={tab}
          onChange={setTab}
          display="flex"
          flexDirection="column"
        >
          <TabList>
            <TabButton>By Name</TabButton>
            <TabButton>User ID</TabButton>
          </TabList>

          <TabPanels overflow="auto" minH="100px">
            <TabPanel px={0}>
              <QueryStatusLayout
                query={nameQuery.query}
                watch={nameQuery.query.data}
                placeholder={<ResultPlaceholder />}
                loading={nameQuery.query.isInitialLoading && <LoadingPanel size="sm" />}
                container={(c) => <Flex direction="column" children={c} />}
                error="Failed to search users"
              >
                {nameQuery.query.data?.map((user) => userItem(user))}
              </QueryStatusLayout>
            </TabPanel>
            <TabPanel px={0}>
              <QueryStatus
                query={idQuery.query}
                loading={idQuery.query.isInitialLoading && <LoadingPanel size="sm" />}
                error="Failed to search user"
              >
                {idQuery.query.data && userItem(idQuery.query.data)}
              </QueryStatus>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </ModalBody>
    </>
  );
}

function MessageBar({
  selected,
  error,
  isDisabled,
  ...props
}: { selected: User; error?: string } & FormControlProps) {
  const [message, setMessage] = useState('');
  const mutation = useMutation(() => sendFriendRequest(selected.id, message));
  const errorMessage = mutation.isError ? parseError(mutation.error) : error;

  return (
    <FormControl isInvalid={errorMessage != null} isDisabled={isDisabled} {...props}>
      <Flex direction="row" gap={2}>
        <Input
          w="full"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          variant="main"
          placeholder="Type your message here..."
        />

        <IconButton
          icon={<BiSend />}
          aria-label="Send"
          onClick={() => mutation.mutate()}
          isLoading={mutation.isLoading}
          disabled={mutation.isLoading || isDisabled}
          variant="brand"
          type="submit"
        />
      </Flex>
      <FormErrorMessage>{errorMessage}</FormErrorMessage>
    </FormControl>
  );
}
