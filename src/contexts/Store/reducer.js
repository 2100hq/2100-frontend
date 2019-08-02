import { set, uniqueId, keyBy } from 'lodash'
import { isPrivateUpdate, remapPrivateData } from './utils'

export const initialState = {
  public: {},
  private: {},
  admin: {},
  error: {},
  config: {},
  intents: {},
  network: {
    loading: true,
    connected: false,
    error: null
  },
  web3: {}
}

export default function reducer (state, action) {
  switch (action.type) {
    case 'UPDATE':
      if (isPrivateUpdate) {
        action = remapPrivateData(action)
      }
      console.log(action.params.path, action.params.data)
      return { ...set(state, action.params.path, action.params.data) }
    case 'ERROR': {
      console.log('ERROR', action.params)
      return { ...state, error: action.params }
    }
    default:
      throw new Error(`Reducer does not handle ${action.type}`)
  }
}
