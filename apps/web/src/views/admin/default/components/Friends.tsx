import { AddIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  Flex,
  Icon,
  SimpleGrid,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import { FriendRequest, FriendRequestType, Relation, RelationShip } from '@omagize/api';
import { UserItemSkeleton } from 'components/card/user/UserItem';
import { FriendItem } from 'components/card/user/FriendItem';
import { FriendRequestItem } from 'components/card/user/FriendRequestItem';
import { Holder, Placeholder } from 'components/layout/Container';
import AddFriendModal from 'components/modals/AddFriendModal';
import { BiSad } from 'react-icons/bi';
import { useUserStore } from 'stores/UserStore';
import { useColors } from 'variables/colors';
import { TabButton } from 'components/layout/Tab';

function CountTab(props: { count: number; children: string }) {
  const { brand } = useColors();

  return (
    <TabButton>
      {props.children}
      <Box bg={brand} color="white" rounded="full" px={2} py={1} ml={2}>
        {props.count}
      </Box>
    </TabButton>
  );
}

export default function Friends() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [friends, friendRequests] = useUserStore((s) => [
    s.relations?.filter((r) => r.type === RelationShip.Friend),
    s.friendRequests,
  ]);

  return (
    <Flex direction="column" gap={3}>
      <AddFriendModal isOpen={isOpen} onClose={onClose} />
      <Tabs isLazy variant="soft-rounded">
        <Flex direction="row" flexWrap="wrap">
          <Text fontSize="2xl" fontWeight="700" mr={2}>
            Your Friends
          </Text>
          <TabList gap={2}>
            <CountTab count={friends?.length}>All</CountTab>
            <CountTab count={friendRequests?.length}>Pending</CountTab>
            <Button onClick={onOpen} colorScheme="green" leftIcon={<AddIcon />}>
              Add
            </Button>
          </TabList>
        </Flex>

        <TabPanels>
          <TabPanel px={0}>
            <All friends={friends} />
          </TabPanel>
          <TabPanel px={0}>
            <Pending />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Flex>
  );
}

function All({ friends }: { friends?: Relation[] }) {
  if (friends != null && friends.length === 0) {
    return <FriendsPlaceholder>You don't have a Friend yet</FriendsPlaceholder>;
  }

  return (
    <SimpleGrid columns={{ base: 1, lg: 2, '2xl': 3 }} gap={5}>
      <Holder
        isLoading={friends == null}
        skeleton={
          <>
            <UserItemSkeleton />
            <UserItemSkeleton />
            <UserItemSkeleton />
          </>
        }
      >
        {friends?.map((friend) => (
          <FriendItem key={friend.user.id} friend={friend} />
        ))}
      </Holder>
    </SimpleGrid>
  );
}

function Pending() {
  const friendRequests = useUserStore((s) => s.friendRequests);
  if (friendRequests != null && friendRequests.length === 0) {
    return <FriendsPlaceholder>No one sent you a friend request</FriendsPlaceholder>;
  }

  return (
    <SimpleGrid columns={{ base: 1, lg: 2, '2xl': 3 }} gap={5}>
      <Holder
        isLoading={friendRequests == null}
        skeleton={
          <>
            <UserItemSkeleton />
            <UserItemSkeleton />
            <UserItemSkeleton />
          </>
        }
      >
        {friendRequests
          ?.sort((a) => (a.type === FriendRequestType.Incoming ? -1 : 1))
          ?.map((request: FriendRequest) => (
            <FriendRequestItem key={request.user.id} request={request} />
          ))}
      </Holder>
    </SimpleGrid>
  );
}

function FriendsPlaceholder({ children }: { children: string }) {
  return <Placeholder icon={<Icon as={BiSad} w={20} h={20} />}>{children}</Placeholder>;
}
