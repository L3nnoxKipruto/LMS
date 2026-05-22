import { createRootRoute, createRoute, createRouter, RouterProvider, Outlet } from '@tanstack/react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider, useAuth } from './contexts/AuthContext';

// Import Route Components
import { Route as RootRoute } from './routes/__root';
import { Route as IndexRoute } from './routes/index';
import { Route as AboutRoute } from './routes/about';
import { Route as ContactRoute } from './routes/contact';
import { Route as HelpRoute } from './routes/help';
import { Route as CatalogRoute } from './routes/catalog';
import { Route as CoursePreviewRoute } from './routes/course.$courseId';
import { Route as LoginRoute } from './routes/login';
import { Route as RegisterRoute } from './routes/register';
import { Route as ForgotPasswordRoute } from './routes/forgot-password';
import { Route as ResetPasswordRoute } from './routes/reset-password';
import { Route as StudentDashboardRoute } from './routes/student.dashboard';
import { Route as CoursePlayerRoute } from './routes/student.course.$courseId.learn';
import { Route as LecturerOverviewRoute } from './routes/lecturer.overview';
import { Route as AdminOverviewRoute } from './routes/admin.overview';

// Create React Query Client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

import { ThemeProviderWrapper } from './theme';

// Programmatic route creation
const rootRoute = createRootRoute({
  component: () => (
    <QueryClientProvider client={queryClient}>
      <ThemeProviderWrapper>
        <AuthProvider>
          <Outlet />
        </AuthProvider>
      </ThemeProviderWrapper>
    </QueryClientProvider>
  ),
});

// Configure Route mappings
const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: IndexRoute.options.component,
});

const aboutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/about',
  component: AboutRoute.options.component,
});

const contactRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/contact',
  component: ContactRoute.options.component,
});

const helpRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/help',
  component: HelpRoute.options.component,
});

const catalogRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/catalog',
  component: CatalogRoute.options.component,
});

const coursePreviewRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/course/$courseId',
  component: CoursePreviewRoute.options.component,
});

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/login',
  component: LoginRoute.options.component,
});

const registerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/register',
  component: RegisterRoute.options.component,
});

const forgotPasswordRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/forgot-password',
  component: ForgotPasswordRoute.options.component,
});

const resetPasswordRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/reset-password',
  component: ResetPasswordRoute.options.component,
});

const studentDashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/student/dashboard',
  component: StudentDashboardRoute.options.component,
});

const coursePlayerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/student/course/$courseId/learn',
  component: CoursePlayerRoute.options.component,
});

const lecturerOverviewRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/lecturer/overview',
  component: LecturerOverviewRoute.options.component,
});

const adminOverviewRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/overview',
  component: AdminOverviewRoute.options.component,
});

// Construct Route Tree
const routeTree = rootRoute.addChildren([
  indexRoute,
  aboutRoute,
  contactRoute,
  helpRoute,
  catalogRoute,
  coursePreviewRoute,
  loginRoute,
  registerRoute,
  forgotPasswordRoute,
  resetPasswordRoute,
  studentDashboardRoute,
  coursePlayerRoute,
  lecturerOverviewRoute,
  adminOverviewRoute,
]);

// Initialize Router
const router = createRouter({
  routeTree,
  context: {
    auth: undefined!, // Placeholder context to satisfy context types if needed
  },
});

declare module '@tanstack/react-router' {
  interface Register {
    router: any;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
