import { watch } from 'vue'
import { useRouter } from 'vue-router'
import { arraysIntersects } from '@semantic-api/common'
import { useStore } from './state/use'
import type { Description } from '@semantic-api/types'

export const bootstrapRoutes = () => {
  const metaStore = useStore('meta')
  const userStore = useStore('user')
  const router = useRouter()

  watch(() => metaStore.descriptions, (descriptions: Record<string, Description>) => {
    Object.values(descriptions).forEach((description) => {
      const routeVisibility = description.route
      if(
        Array.isArray(routeVisibility)
          && arraysIntersects(userStore.$currentUser.roles, routeVisibility)
      ) {
        return
      }

      const routeName = `dashboard-${description.$id}`
      if( router.hasRoute(routeName) ) {
        return
      }

      const route = {
        name: routeName,
        path: description.$id,
        redirect: `/dashboard/c/${description.$id}`,
        meta: {
          title: description.$id,
          icon: description.icon,
        }
      }

      router.addRoute('dashboard', route)
    })

  }, { immediate: true })
}
