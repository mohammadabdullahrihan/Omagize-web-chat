import React from 'react';
import ReactDOM from 'react-dom';
import './assets/css/App.css';
import {BrowserRouter, Navigate, Route, Routes} from 'react-router-dom';

import {ChakraProvider} from '@chakra-ui/react';
import theme from './theme/theme';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import routes from "./routes";
import {layouts} from "./layouts";

const client = new QueryClient()
function getRoutes(layout: string): any {
	return routes.map((route: RoutesType, key: any) => {
		if (route.layout === layout) {
			return <Route path={route.layout + route.path} element={route.component} key={key} />;
		} else {
			return null;
		}
	});
}

function Pages() {

	return <Routes>
		{
			layouts.map((layout, i) =>
				<Route key={i} path={layout.path} element={layout.component}>
					{getRoutes(layout.path)}
					{layout.index && <Route index element={<Navigate to={layout.index}/>}/>}
					{layout.default && <Route path="*" element={<Navigate to={layout.default}/>}/>}
				</Route>
			)
		}
		<Route path='*' element={<Navigate to="/admin" />} />
	</Routes>
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