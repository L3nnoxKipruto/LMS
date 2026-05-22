import { Outlet } from '@tanstack/react-router';

export const Route = {
  options: {
    component: RootComponent,
  },
};

function RootComponent() {
  return <Outlet />;
}
