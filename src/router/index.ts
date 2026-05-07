import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'

import AuthLayout from '@/components/layout/auth-layout.vue'
import MainLayout from '@/components/layout/main-layout.vue'
import routes from '~pages'

type TRouteByLayout = {
  main: RouteRecordRaw[]
  auth: RouteRecordRaw[]
  noLayout: RouteRecordRaw[]
}

const authLayoutPrefix = ['auth', 'profil']

const organizeRoutesByLayout = (routes: RouteRecordRaw[]): TRouteByLayout => {
  const routeByLayout: TRouteByLayout = {
    main: [],
    auth: [],
    noLayout: [],
  }

  routes.forEach(route => {
    const { path } = route
    if (!path || path === '/:all(.*)*') {
      routeByLayout.noLayout.push(route)
      return
    }

    const matchingAuthPrefix = authLayoutPrefix.find(prefix => path.startsWith(prefix) || path.startsWith(`/${prefix}`))
    if (matchingAuthPrefix) {
      const childPath = path.replace(/^\//, '').replace(matchingAuthPrefix, '').replace(/^\//, '')
      routeByLayout.auth.push({ ...route, path: childPath })
      return
    }

    routeByLayout.main.push(route)
  })

  return routeByLayout
}

const routeByLayout = organizeRoutesByLayout(routes)

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: MainLayout,
      children: routeByLayout.main,
    },
    ...authLayoutPrefix.map(prefix => ({
      path: `/${prefix}`,
      component: AuthLayout,
      children: routeByLayout.auth.filter(r => routes.find(o => o.name === r.name)?.path.includes(prefix)),
    })),
    ...routeByLayout.noLayout,
  ],
  scrollBehavior(to, from, savedPosition) {
    if (to.hash) return { el: to.hash, behavior: 'smooth' }
    if (savedPosition) return savedPosition
    if (to.path === '/' && from.path === '/') return false
    return { top: 0 }
  },
})

router.beforeResolve((to, from) => {
  if (!document.startViewTransition) return

  const isQueryChangeOnly = from.path === to.path && JSON.stringify(from.query) !== JSON.stringify(to.query)
  if (isQueryChangeOnly) return

  return new Promise(resolve => {
    const transition = document.startViewTransition(async () => {
      const fromLayout = from.matched[0]?.components?.default
      const toLayout = to.matched[0]?.components?.default
      const isSameLayout = fromLayout === toLayout && fromLayout !== undefined

      const isBackNavigation =
        (to.path === '/' && from.path !== '/') || (from.path.startsWith(to.path) && from.path !== to.path)

      document.documentElement.classList.toggle('back-transition', isBackNavigation)
      document.documentElement.classList.toggle('layout-persist', isSameLayout)

      resolve()
      await new Promise(r => setTimeout(r, 0))
    })

    transition.finished.finally(() => {
      document.documentElement.classList.remove('back-transition')
      document.documentElement.classList.remove('layout-persist')
    })
  })
})

export default router
