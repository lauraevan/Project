import { createRootRoute, createRoute, createRouter } from '@tanstack/react-router'
import { Shell } from './components/Shell'
import { Home } from './pages/Home'
import { TitlePage } from './pages/TitlePage'
import { Browse } from './pages/Browse'

const rootRoute = createRootRoute({ component: Shell })

const homeRoute = createRoute({ getParentRoute: () => rootRoute, path: '/', component: Home })
const moviesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/films',
  component: () => <Browse kind="movie" />,
})
const seriesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/series',
  component: () => <Browse kind="tv" />,
})
const titleRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/title/$type/$id',
  component: TitlePage,
})

const routeTree = rootRoute.addChildren([homeRoute, moviesRoute, seriesRoute, titleRoute])

export const router = createRouter({ routeTree, defaultPreload: 'intent' })

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}
