import { Button, ButtonGroup, Flex, FormControl, Grid, HStack, Input } from '@chakra-ui/react';
import {
  createRole,
  Snowflake,
  updateRoles,
  UpdateRolesOptions,
  useGroupDetailQuery,
} from '@omagize/api';
import { useMutation } from '@tanstack/react-query';
import LoadingPanel from 'components/panel/LoadingPanel';
import { SelectedRole, usePermissionManagePanel } from 'components/panel/PermissionManagePanel';
import { QueryStatus } from 'components/panel/QueryPanel';
import { SaveBar } from 'components/panel/SaveBar';
import { useState } from 'react';
import { DragDropContext } from 'react-beautiful-dnd';
import { DefaultRoleItem, Roles } from './Roles';

export function RolePanel({ groupId }: { groupId: Snowflake }) {
  const query = useGroupDetailQuery(groupId);
  const [name, setName] = useState('');
  const [value, setValue] = useState<UpdateRolesOptions>({});
  const [open, setOpen] = useState<SelectedRole>();
  const panel = usePermissionManagePanel(open, value, setValue);
  const group = query.data;

  return (
    <Grid templateColumns="1fr 1fr" gap={3}>
      <QueryStatus loading={<LoadingPanel size="sm" />} query={query} error="Failed to load roles">
        <Flex direction="column" gap={3} overflow="auto">
          <CreateRolePanel group={groupId} name={name} setName={setName} />
          <DragDropContext onDragEnd={() => {}}>
            <Roles
              roles={group?.roles.filter((role) =>
                role.name.toLowerCase().startsWith(name.toLowerCase())
              )}
              selected={open}
              setSelected={setOpen}
            />
          </DragDropContext>
          <DefaultRoleItem
            selected={open?.type === 'default_role'}
            role={group?.defaultRole}
            onClick={() =>
              setOpen({
                type: 'default_role',
                role: group?.defaultRole,
              })
            }
          />
        </Flex>
      </QueryStatus>
      {panel}
      <RolesSaveBar group={query.data?.id} value={value} reset={() => setValue({})} />
    </Grid>
  );
}

function CreateRolePanel({
  group,
  name,
  setName,
}: {
  group: Snowflake;
  name: string;
  setName: (v: string) => void;
}) {
  const mutation = useMutation(() => createRole(group, name));

  return (
    <FormControl>
      <HStack>
        <Input
          w="full"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          variant="focus"
          placeholder="Role name..."
        />
        <Button
          variant="brand"
          isLoading={mutation.isLoading}
          onClick={() => mutation.mutate()}
          disabled={mutation.isLoading || name.trim().length === 0}
        >
          Create
        </Button>
      </HStack>
    </FormControl>
  );
}

function RolesSaveBar({
  value,
  group,
  reset,
}: {
  value: UpdateRolesOptions;
  group: Snowflake;
  reset: () => void;
}) {
  const mutation = useMutation(() => updateRoles(group, value), {
    onSuccess() {
      reset();
    },
  });

  return (
    <SaveBar isOpen={Object.entries(value).length !== 0}>
      <ButtonGroup isDisabled={mutation.isLoading} ml="auto">
        <Button
          rounded="full"
          colorScheme="green"
          isLoading={mutation.isLoading}
          onClick={() => mutation.mutate()}
        >
          Save
        </Button>
        <Button rounded="full" onClick={reset}>
          Discard
        </Button>
      </ButtonGroup>
    </SaveBar>
  );
}
