import { defineStore } from 'pinia'
import { SV_API_URL } from '@semantic-api/types'
import useCollection from '../state/collection'

const collection = useCollection({
  state: {
    limit: 150
  },
  actions: {
    download(payload: any) {
      const item = payload || this.item
      window.open(`${SV_API_URL}/file/${item.file?._id}/download`)
    }
  }
})

export default defineStore('report', collection)
