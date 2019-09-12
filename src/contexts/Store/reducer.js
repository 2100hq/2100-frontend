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
  auth: {},
  web3: {}
}

function update(state, action, clone=true){
  if (isPrivateUpdate) {
    action = remapPrivateData(action)
  }
  //console.log(new Date().toISOString(), 'STATE UPDATE >',action.params.path, action.params.data)
  state = set(state, action.params.path, action.params.data)
  if (!clone) return state
  return { ...state }
}

export default function reducer (state, action) {
  switch (action.type) {
    case 'UPDATE':
      return update(state, action)
    case 'BATCH_UPDATE':
      const events = action.params.events
      events.forEach( ([path, data]) => {
        const fakeAction = {...action, params: {path, data} }
        state = update(state, fakeAction, false)
      })
      return {...state}
    case 'ERROR': {
      console.log('ERROR', action.params)
      return { ...state, error: action.params }
    }
    default:
      throw new Error(`Reducer does not handle ${action.type}`)
  }
}
