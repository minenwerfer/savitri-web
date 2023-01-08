import type { CollectionProperty } from '@semantic-api/types'
import type { CollectionState, CollectionGetters } from '../../types/state'

type CrudParameters = {
  filters: any
  limit: number
  offset: number
}

type ActionOptions = {
  method?:
    'GET'
    | 'POST'
    | 'PUT'
    | 'DELETE'
  unproxied?: boolean
  skipLoading?: boolean
  skipEffect?: boolean
  fullResponse?: boolean
}

type ActionFilter = Partial<Pick<CrudParameters,
  'filters'
  | 'limit'
  | 'offset'>
>

export type Item = Record<string, any> & {
  _id?: string
}

interface ActionsAux {
  $functions: (...args: any[]) => any
  custom(verb: string|null, payload?: string, options?: ActionOptions): Promise<any>
  customEffect(verb: string|null, payload: any, fn: (payload: any) => any, options?: ActionOptions): Promise<any>
  $customEffect(verb: string|null, payload: any, fn: (payload: any) => any, options?: ActionOptions): Promise<any>
  get(payload: ActionFilter, options?: ActionOptions): Promise<any>
  getAll(payload: ActionFilter): Promise<any>
  insert(payload?: { what: Item }, options?: ActionOptions): Promise<Item>
  deepInsert(payload?: { what: Item }): Promise<Item>
  delete(payload: { filters?: Item }): Promise<Item>
  deleteAll(payload: { filters?: Item }): Promise<Item>
  filter(props?: { project: Array<string> }): Promise<any>
  updateItems(): Promise<any>
  clearFilters(): CollectionState<any>['freshFilters']
  ask(props: {
    action: (params: any) => unknown,
    params: any
    title?: string
    body?: string
  }): Promise<any>
  useProperties(properties: Array<string>): Record<string, CollectionProperty>
  usePropertiesExcept(properties: Array<string>): Record<string, CollectionProperty>
  formatValue(args: {
      value: string|object,
      key: string,
      form: boolean,
      property: CollectionProperty
    }
  ): string
  getIndexes(args: { key: string, form: boolean }): Array<string>
}

interface MutationsAux {
  setItem(item: Item): Item
  setItems(items: Array<any>): Array<any>
  insertItem(item: Item): Item
  removeItem(item: Item): Item
  clearItem(): Item
  clearItems(): void
}

export type StatefulFunction<
  T extends (...args: any) => any,
  This=CollectionState<any> & CollectionGetters & {
    $patch: (props: object) => void
  }
> = (this: This & ActionsAux & MutationsAux, ...args: Parameters<T>) => ReturnType<T>

export type Actions = { [P in keyof ActionsAux]: StatefulFunction<ActionsAux[P]> }
export type Mutations = { [P in keyof MutationsAux]: StatefulFunction<MutationsAux[P]> }
