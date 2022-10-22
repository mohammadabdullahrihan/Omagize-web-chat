import React from 'react';
import ReactDOM from 'react-dom';
import './assets/css/App.css';
import 'react-image-crop/dist/ReactCrop.css';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { ChakraProvider } from '@chakra-ui/react';
import theme from './theme/theme';
import { QueryClientProvider } from '@tanstack/react-query';
import { layouts, NormalLayout } from './layouts';
import { client, initClient, useLoginQuery } from '@omagize/api';
import LoadingScreen from './components/screens/LoadingScreen';
import { ErrorScreen } from 'components/layout/ErrorScreen';

initClient();
function RootRoutes({ loggedIn }: { loggedIn: boolean }) {
  function mapNestedLayout(layout: NormalLayout, key: string | number) {
    if (layout.index === true) {
      return <Route index key={key} element={layout.component} />;
    } else {
      return (
        <Route key={key} path={layout.path} element={layout.component}>
          {layout.subLayouts && layout.subLayouts.map(mapNestedLayout)}
        </Route>
      );
    }
  }

  return (
    <Routes>
      {layouts.map((layout, key) =>
        layout.loggedIn === loggedIn ? mapNestedLayout(layout, key) : null
      )}

      <Route
        path="*"
        element={<Navigate to={loggedIn ? '/user' : '/auth'} />}
      />
    </Routes>
  );
}

function Pages() {
  const query = useLoginQuery();

  if (query.isLoading) return <LoadingScreen />;
  if (query.isError)
    return (
      <ErrorScreen retry={() => query.refetch()}>Failed to login</ErrorScreen>
    );

  return <RootRoutes loggedIn={query.data != null} />;
}

ReactDOM.render(
  <ChakraProvider theme={theme}>
    <QueryClientProvider client={client}>
      <React.StrictMode>
        <BrowserRouter>
          <Pages />
        </BrowserRouter>
      </React.StrictMode>
    </QueryClientProvider>
  </ChakraProvider>,
  document.getElementById('root')
);
