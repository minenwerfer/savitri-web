import { defineStore } from 'pinia'
import { deepClone } from '@semantic-api/common'
import { Description } from '@semantic-api/types'
import { default as webpackVariables } from 'variables'
import useHttp from '../http'
import useCollection from '../state/collection'

import { useStore, hasStore, registerStore } from '../state/use'
import { freshItem, freshFilters } from '../state/helpers'

type CollectionName = string
type PromptAnswer = { name: string }

const { http } = useHttp()

export default defineStore('meta', {
  state: () => ({
    descriptions: [],
    roles: {},

    isLoading: false,
    globalIsLoading: false,
    theme: '',

    view: {
      title: '',
      layout: 'tabular',
      collection: ''
    },
    wizard: {
      current: '',
      step: 1
    },
    menu: {
      isVisible: true,
      isMobileVisible: false
    },
    modal: {
      isVisible: false,
      title: '',
      body: '',
      image: '',
      component: '',
      details: {}
    },
    prompt: {
      isVisible: false,
      title: '',
      body: '',
      actions: [],
    },
    toasts: [],
  }),

  actions: {
    async describeAll() {
      this.isLoading = true
      const response = await http.get('_/meta/describeAll')
      const descriptions: Record<CollectionName, Description> =
        this.descriptions = response.data.result.descriptions

      this.roles = response.data.result.roles

      // monkeypatchs '@savitri/web/stores' object
      for ( const [collectionName, description] of Object.entries(descriptions) ) {
        const rawDescription = Object.assign({}, description)
        const item = freshItem(description)
        const filters = freshFilters(description)

        if( !description.properties ) {
          throw new Error(
            `collection ${collectionName} has no properties`
          )
        }

        // description.properties = await hydrateQuery(description.properties, false)

        if( hasStore(collectionName) ) {
          const store = useStore(collectionName)
          store.$patch({
            item,
            filters,
            freshItem: deepClone(item),
            freshFilters: deepClone(filters),
            description,
            rawDescription
          })
          continue
        }

        const {
          state,
          actions,
          getters
        } = useCollection()

        const store = defineStore(collectionName, {
          state: () => Object.assign(state(), {
            item,
            filters,
            freshItem: deepClone(item),
            freshFilters: deepClone(filters),
            description,
            rawDescription
          }),

          actions,
          getters
        })

        registerStore(store)
      }

      this.isLoading = false
    },

    swapMenu() {
      this.menu.isVisible = !this.menu.isVisible
      localStorage.setItem('meta:menu:isVisible', String(this.menu.isVisible))
    },

    spawnPrompt(props: {
      title?: string
      body?: string
      actions: Array<{
        name: string
        title: string
        size?: string
        variant?: string
      }>
    }): Promise<PromptAnswer> {
      this.$patch({
        prompt: {
          ...props,
          isVisible: true
        } as any
      })

      return new Promise((resolve) => {
        const event = ({ detail }: any) => {
          window.removeEventListener('__prompt', event)
          this.prompt.isVisible = false
          resolve(detail.option)
        }

        window.addEventListener('__prompt', event)
      })
    },

    fulfillPrompt(answer: PromptAnswer) {
      window.dispatchEvent(new CustomEvent('__prompt', {
        detail: { option: answer }
      }))
    },

    spawnModal(props: Omit<typeof this['modal'], 'isVisible'>) {
      this.$patch({
        modal: {
          ...props,
          isVisible: true
        }
      })
    },

    spawnToast(
      this: { toasts: Array<any> },
      props: {
        text: string
        icon?: string
      }
    ) {
      this.toasts.push({
        ...props,
        itr: Math.random(),
        idx: this.toasts.length,
        date: new Date()
      })
    },

    popToast(this: { toasts: Array<any> }, itr?: Date) {
      if( !itr ) {
        this.toasts.shift()
        return
      }

      this.toasts = this.toasts
        .filter((toast) => toast.itr !== itr)
    },

    saveTheme() {
      localStorage.setItem('meta:theme', this.theme)
    },
  },

  getters: {
    $theme(): string {
      if( !this.theme ) {
        const defaultTheme = webpackVariables.defaultTheme || 'default'
        this.theme = localStorage.getItem('meta:theme') || defaultTheme
      }

      return this.theme
    }
  }
})
