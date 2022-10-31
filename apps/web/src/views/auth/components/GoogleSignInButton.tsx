import { Button, ButtonProps, Icon } from '@chakra-ui/react';
import { FirebaseAuth, Keys } from '@omagize/api';
import { useMutation } from '@tanstack/react-query';
import { FcGoogle } from 'react-icons/fc';

export function GoogleSignInButton(props: ButtonProps) {
  const signin = useMutation(Keys.firebase.signin, () =>
    FirebaseAuth.signInWithGoogle()
  );

  return (
    <Button
      fontSize="sm"
      mb="26px"
      py="25px"
      fontWeight="500"
      isLoading={signin.isLoading}
      onClick={() => signin.mutate()}
      {...props}
    >
      <Icon as={FcGoogle} w="20px" h="20px" me="10px" />
      Sign up with Google
    </Button>
  );
}
