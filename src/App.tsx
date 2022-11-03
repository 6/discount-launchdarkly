import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { ChakraProvider, ColorModeScript } from '@chakra-ui/react';
import { theme } from './theme';
import { DashboardScreen } from 'components/dashboard';
import { SegmentsScreen } from 'components/segments';
import { LaunchDarklyApiProvider } from 'providers/launchdarkly-api';
import { LaunchDarklyConfigProvider } from 'providers/launchdarkly-config';

export const App = () => {
  return (
    <BrowserRouter>
      <ChakraProvider theme={theme}>
        <ColorModeScript initialColorMode={theme.config.initialColorMode} />
        <LaunchDarklyApiProvider>
          <LaunchDarklyConfigProvider>
            <Routes>
              <Route path="/" element={<DashboardScreen />} />
              <Route path="/segments" element={<SegmentsScreen />} />
            </Routes>
          </LaunchDarklyConfigProvider>
        </LaunchDarklyApiProvider>
      </ChakraProvider>
    </BrowserRouter>
  );
};
