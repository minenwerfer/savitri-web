import { RequestProvider } from '@semantic-api/common'
import { SV_API_URL } from '@semantic-api/types'
import { useStore } from './state'

export default () => {
  return {
    http: proxiedHttp,
    nonProxiedHttp: http,
    apiUrl: SV_API_URL
  }
}

const http = new RequestProvider({
  baseURL: SV_API_URL
})

/**
 * @function
 * Catchs errors then spawns a modal.
 */
const httpMethodWrapper = (
  target: RequestProvider,
  method: any,
  ...args: any
) => new Promise((resolve, reject) => {
  const call = method.apply(target, ...args)
  if( !(call instanceof Promise) ) {
    return call
  }

  return call
    .then(resolve)
    .catch(async (error: any) => {
      const metaStore = useStore('meta')

      if( !error.silent ) {
        metaStore.spawnModal({
          title: 'Erro',
          body: error
        })
      }

      if( error.logout || ['JsonWebTokenError'].includes(error.name) ) {
        sessionStorage.clear()
        ROUTER.push({ name: 'user-signin' })
      }

      console.trace(error)
      reject(error)
    })
})

const proxiedHttp = new Proxy(http, {
  get: (target: any, key: string) => {
    const method = target[key]
    const subscribedMethods = [
      'request',
      'get',
      'post'
    ]

    return subscribedMethods.includes(key)
      ? (...args: any) => httpMethodWrapper(target, method, [...args])
      : (typeof method === 'function' ? (...args: any) => method.apply(target, args) : method)
  }
})
