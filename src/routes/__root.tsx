import { createRootRoute, Outlet } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';
import SidebarMenu from '../helpers/SidebarMenu';

export const Route = createRootRoute({
  component: () => (
    <>
      <SidebarMenu />
      <div className="ml-12 min-h-screen">
        <Outlet />
      </div>
      <TanStackRouterDevtools />
    </>
  )
});
