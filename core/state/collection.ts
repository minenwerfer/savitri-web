import * as R from 'ramda'
import { PAGINATION_PER_PAGE_DEFAULT } from '@semantic-api/types'
import type { CollectionState } from '../../types/state'
import actions from './actions'
import getters from './getters'

type StoreOptions =
  'state'
  | 'actions'
  | 'getters'

export default (
  newer?: {
    [P in StoreOptions]?: Record<string, any>
  }
) => {
  const initial = {
    state,
    actions,
    getters
  }

  const fn = (key:string, l:any, r:any) => {
    if( key === 'state' ) {
      const res = typeof r === 'function' ? r() : r
      return () => R.mergeAll([l(), res])
    }

    if( R.is(Function, r) ) {
      return r
    }

    return R.is(Object, l) && R.is(Object, r)
      ? R.concat(l, r)
      : r
  }

  return newer
    ? R.mergeDeepWithKey(fn, initial, newer)
    : initial
}

const state = <T=object>() => {
  const ret = {
    item: {},
    freshItem: {},
    referenceItem: {},
    items: [],
    filters: {},
    freshFilters: {},
    activeFilters: {},

    selected: [],
    currentLayout: '',

    queryCache: {},
    description: {},
    rawDescription: {},

    validationErrors: {},

    isLoading: false,
    halt: false,

    pagination: {
      offset: 0,
      limit: PAGINATION_PER_PAGE_DEFAULT,
      recordsCount: 0,
      recordsTotal: 0,
      currentPage: 0
    }
  }

  return ret as typeof ret & CollectionState<T>
}

