import { inject } from 'vue'

const stores: typeof STORES = {}
Object.assign(window, { STORES: stores })

stores.meta = require('../stores/meta').default
stores.user = require('../stores/user').default
stores.report = require('../stores/report').default

export const useStore = (storeId: string) => {
  if( !(storeId in STORES) ) {
    throw new Error(`tried to invoke unregistered store "${storeId}"`)
  }

  const store = STORES[storeId]()
  if( store.$functions ) {
    store.functions = store.$functions()
  }

  return store
}

export const useParentStore = (fallback?: string) => {
  let parentStoreId = inject<any>('storeId', null)
  if( !parentStoreId ) {
    if( !fallback ) {
      throw new Error('no parent store found')
    }

    parentStoreId = fallback
  }

  return useStore(parentStoreId.value||parentStoreId)
}

export const hasStore = (storeId: string) => {
  return storeId in stores
}

export const registerStore = async <
  T extends { $id: string },
  F extends (() => T) & T,
  A extends Promise<{ default: F }>
>(fn: F | A): Promise<void> => {
  if( fn instanceof Promise ) {
    return fn.then((store) => {
      registerStore(store.default)
    })
  }

  const store: F = fn as F
  const storeId = store.$id
  STORES[storeId] = fn
}
