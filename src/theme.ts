import { extendTheme } from '@chakra-ui/react';
import { mode, StyleFunctionProps } from '@chakra-ui/theme-tools';

export const theme = extendTheme({
  initialColorMode: 'dark',
  useSystemColorMode: false,
  styles: {
    global: (props: StyleFunctionProps) => ({
      fonts: {
        heading: `'Source Code Pro', monospace`,
        body: `'Source Code Pro', monospace`,
      },
      body: {
        color: mode('gray.800', 'whiteAlpha.900')(props),
        bg: mode('gray.50', 'gray.800')(props),
      },
    }),
  },
});
