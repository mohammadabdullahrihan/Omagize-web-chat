import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  Text,
  Button,
  Icon,
  FormControl,
  Input,
  FormLabel,
  Flex,
  HStack,
  FormErrorMessage,
} from '@chakra-ui/react';
import { firebase, FirebaseAuth } from '@omagize/api';
import { useMutation } from '@tanstack/react-query';
import { FirebaseError } from 'firebase/app';
import { EmailAuthProvider, GoogleAuthProvider } from 'firebase/auth';
import { useState } from 'react';
import { FcGoogle } from 'react-icons/fc';
import { parseErrorMessage } from 'utils/APIUtils';
import { useColors } from 'variables/colors';

export type ReauthTarget = {
  onDone: () => void;
};
type ProviderProps = { onSuccess: () => void };
export default function ReAuthentricateModal({
  target,
  onClose,
  message,
}: {
  message: string;
  onClose: () => void;
  target?: ReauthTarget;
}) {
  const providers = firebase.auth.currentUser.providerData;
  const { textColorSecondary } = useColors();
  const onDone = () => {
    target?.onDone();
    onClose();
  };

  return (
    <Modal isOpen={target != null} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Verify Required</ModalHeader>
        <ModalBody>
          <Text color={textColorSecondary}>{message}</Text>
          <Flex direction="column" gap={2} mt={4}>
            {target != null &&
              providers.map((provider) => {
                const id = provider.providerId;

                switch (id) {
                  case GoogleAuthProvider.PROVIDER_ID:
                    return <Google key={id} onSuccess={onDone} />;
                  case EmailAuthProvider.PROVIDER_ID:
                    return <Email key={id} onSuccess={onDone} />;
                  default:
                    return <></>;
                }
              })}
          </Flex>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}

function Email({ onSuccess }: ProviderProps) {
  const id = 'password';
  const [password, setPassword] = useState<string>('');

  const mutation = useMutation(
    (pw: string) => FirebaseAuth.reauth.withPassword(pw),
    {
      onSuccess,
    }
  );
  return (
    <FormControl isInvalid={mutation.isError}>
      <FormLabel fontSize="xl" fontWeight="600" htmlFor={id}>
        Email and Password
      </FormLabel>
      <HStack>
        <Input
          flex={1}
          id={id}
          type="password"
          variant="main"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button
          isLoading={mutation.isLoading}
          onClick={() => mutation.mutate(password)}
          type="submit"
        >
          Submit
        </Button>
      </HStack>
      <FormErrorMessage>
        {mutation.error instanceof FirebaseError &&
          parseErrorMessage(mutation.error as FirebaseError)}
      </FormErrorMessage>
    </FormControl>
  );
}

function Google({ onSuccess }: ProviderProps) {
  const mutation = useMutation(() => FirebaseAuth.reauth.withGoogle(), {
    onSuccess,
  });

  return (
    <FormControl isInvalid={mutation.isError}>
      <FormLabel fontSize="xl" fontWeight="600">
        Google
      </FormLabel>
      <Button
        leftIcon={<Icon as={FcGoogle} />}
        isLoading={mutation.isLoading}
        onClick={() => mutation.mutate()}
      >
        Verify With Google
      </Button>
      <FormErrorMessage>
        {mutation.error instanceof FirebaseError &&
          parseErrorMessage(mutation.error as FirebaseError)}
      </FormErrorMessage>
    </FormControl>
  );
}
