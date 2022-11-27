import { dark, light } from 'variables/colors';
import { mode } from '@chakra-ui/theme-tools';
import { defineStyle, defineStyleConfig } from '@chakra-ui/react';

export const textareaStyles = defineStyleConfig({
  baseStyle: defineStyle((props) => ({
    fontWeight: 400,
    borderRadius: '8px',
    fontSize: 'md',
    bg: mode(light.globalBg, dark.globalBg)(props),
    rounded: 'lg',
    border: 0,
    _focus: { boxShadow: 'none' },
  })),
  defaultProps: {
    variant: null,
  },
  variants: {
    main: defineStyle((props: any) => ({
      bg: mode('transparent', 'navy.800')(props),
      border: '2px solid',
      color: mode('secondaryGray.900', 'white')(props),
      borderColor: mode('secondaryGray.400', 'navy.600')(props),
      borderRadius: '16px',
      fontSize: 'sm',
      p: '20px',
      _placeholder: {
        color: mode('secondaryGray.700', 'secondaryGray.600')(props),
      },
    })),
    auth: defineStyle({
      bg: 'white',
      border: '1px solid',
      borderColor: 'secondaryGray.100',
      borderRadius: '16px',
      _placeholder: { color: 'secondaryGray.600' },
    }),
    authSecondary: defineStyle({
      bg: 'white',
      border: '1px solid',

      borderColor: 'secondaryGray.100',
      borderRadius: '16px',
      _placeholder: { color: 'secondaryGray.600' },
    }),
  },
});
