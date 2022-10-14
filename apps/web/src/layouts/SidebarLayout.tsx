import { PageContextProvider } from '../contexts/PageContext';
import { SidebarContext } from '../contexts/SidebarContext';
import { Flex } from '@chakra-ui/react';
import { ReactNode, useState } from 'react';
import Sidebar from '../components/sidebar/Sidebar';
import items from '../sidebar';
import { Outlet } from 'react-router-dom';

export default function SidebarLayout(props: { sidebar?: ReactNode }) {
  const [toggleSidebar, setToggleSidebar] = useState(false);

  return (
    <Flex direction="row" h="full">
      <PageContextProvider>
        <SidebarContext.Provider
          value={{
            toggleSidebar,
            setToggleSidebar,
          }}
        >
          {props.sidebar || <Sidebar items={items} display="none" />}
          <Outlet />
        </SidebarContext.Provider>
      </PageContextProvider>
    </Flex>
  );
}
