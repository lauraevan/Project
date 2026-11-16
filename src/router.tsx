import { createRootRoute, createRoute, createRouter } from '@tanstack/react-router'
import { Shell } from './components/Shell'
import { Home } from './pages/Home'
import { TitlePage } from './pages/TitlePage'
import { Browse } from './pages/Browse'
import { SearchPage } from './pages/Search'
import { MyList } from './pages/MyList'

const rootRoute = createRootRoute({ component: Shell })

const homeRoute = createRoute({ getParentRoute: () => rootRoute, path: '/', component: Home })
const moviesRoute = createRoute({ getParentRoute: () => rootRoute, path: '/films', component: () => <Browse kind="movie" /> })
const seriesRoute = createRoute({ getParentRoute: () => rootRoute, path: '/series', component: () => <Browse kind="tv" /> })
const listRoute = createRoute({ getParentRoute: () => rootRoute, path: '/list', component: MyList })
const searchRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/search',
  validateSearch: (s: Record<string, unknown>) => ({ q: typeof s.q === 'string' ? s.q : '' }),
  component: SearchPage,
})
const titleRoute = createRoute({ getParentRoute: () => rootRoute, path: '/title/$type/$id', component: TitlePage })

const routeTree = rootRoute.addChildren([homeRoute, moviesRoute, seriesRoute, listRoute, searchRoute, titleRoute])

export const router = createRouter({ routeTree, defaultPreload: 'intent', scrollRestoration: false })

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}
