import { defineStore } from 'pinia'
import type { User } from '@semantic-api/system/resources/collections/user/user.description'
import useCollection from '../state/collection'
import useMetaStore from './meta'

type Credentials = {
  email: string
  password: string
}

type UserState = {
  credentials: Credentials|object
  currentUser: Partial<User>
}

const collection = useCollection({
  state: (): UserState => ({
    currentUser: {},
    credentials: {
      email: '',
      password: ''
    }
  }),
  actions: {
    authenticate(payload: Credentials) {
      try {
        return this.customEffect(
          'authenticate', payload,
          async ({ user, token: _token }: {
            user: User
            token: { 
              type: 'Bearer'
              token: string
            }
          }) => {
            this.credentials = {}
            this.currentUser = { ...user }

            const {
              type: _tokenType,
              token
            } = _token

            sessionStorage.setItem('auth:token', token)
            sessionStorage.setItem('auth:currentUser', JSON.stringify(user))

            const metaStore = useMetaStore()
            await metaStore.describeAll()
          }
        )
      } catch( err ) {
        this.signout()
        throw err
      }
    },

    signout() {
      sessionStorage.clear()
      this.currentUser = {}
    }
  },
  getters: {
    properties() {
      const metaStore = useMetaStore()
      const properties = this.description.properties!
      properties.roles.items.enum = Object.keys(metaStore.roles)

      return properties
    },

    $currentUser(): User {
      if( !this.currentUser?._id ) {
        this.currentUser = JSON.parse(sessionStorage.getItem('auth:currentUser')||'{}')
      }

      return this.currentUser
    }
  }
})

export default defineStore('user', collection)
