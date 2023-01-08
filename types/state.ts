import type { StoreGeneric } from 'pinia'
import type { Description } from '@semantic-api/types'
import type { Getters } from '../core/state/getters'
import collectionActions from '../core/state/actions'

export type PiniaState = {
  readonly $id: string
}

export type Pagination = {
  limit: number
  offset: number
  recordsCount: number
  recordsTotal: number
  currentPage: number
}

export type ValidationError = {
  type: string
  detail: string
}

export type ValidationErrors = Record<string, ValidationError>

export type CollectionState<Item> = PiniaState & {
  item: Item|object
  freshItem: Partial<Item>
  referenceItem: Partial<Item>
  items: Array<Item>
  filters: Partial<Item>
  freshFilters: any
  activeFilters: any

  selected: Array<Item>
  currentLayout: string

  queryCache: Record<string, any>
  description: Readonly<Partial<Description>>
  rawDescription: Readonly<Partial<Description>>

  validationErrors: ValidationErrors

  isLoading: boolean
  halt: boolean

  pagination: Pagination
}

export type CollectionGetters = Getters

export type CollectionStore<T=any> = CollectionState<T>
  & typeof collectionActions
  & CollectionGetters
  & StoreGeneric

export type CollectionStructure<T=any> = CollectionState<T> & {
  getters?: any
  actions?: any
}
