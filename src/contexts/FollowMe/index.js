import React, {
  createContext,
  useContext,
  useMemo,
  useEffect,
  useState,
  useReducer
} from 'react'

import { set,sortBy, keyBy } from 'lodash'
import {useStoreContext} from '../Store'

import API from './API'

export const FollowMeContext = createContext()

export function useFollowMeContext () {
  return useContext(FollowMeContext)
}

export const FollowMeContextConsumer = FollowMeContext.Consumer

function reducer (state, action) {
  switch (action.type) {
    case 'UPDATE':
      // console.log(action.params.path, action.params.data)
      return { ...set(state, action.params.path, action.params.data) }
    default:
      throw new Error(`Reducer does not handle ${action.type}`)
  }
}


export default function FollowMeProvider ({ children }) {
  const { state:appstate, actions, dispatch:appdispatch } = useStoreContext()
  const [fmstate, dispatch] = useReducer(reducer, {})
  const { api,isSignedIn, myToken, threshold } = fmstate
  const isSignedIn2100 = appstate.private.isSignedIn
  const ethAddress = appstate.web3.account
  const [followerCount, setFollowerCount] = useState(0)

  const update = (path, ...args) => dispatch(actions.update(path, ...args))
  useEffect( () => {

    if (!appstate.config.followMeUrl || api) return
    dispatch(actions.update('api', {
      public:API(appstate.config.followMeUrl,'public'),
      private:API(appstate.config.followMeUrl,'private'),
    }))
  }, [appstate.config.followMeUrl])


  async function updateInbox(){
    let resp = await api.private.call('getMyInbox')
     update('messages', keyBy(resp, 'id'))
  }

  async function updateFollowerCount(tokenid){
    const followers = await api.private.call('followers', tokenid)
    update('followers', followers)
  }

  useEffect( () => {
    if (!api) return

    // logged in and know address
    if (!isSignedIn && isSignedIn2100 && ethAddress){
      api.private.setToken(ethAddress)
      const asyncs = [api.private.call('me'),api.private.call('myTokens')]
      Promise.all(asyncs).then( async ([me, tokens]) => {
        if (tokens.length > 0){
          update('myToken', tokens[0])
        }
        update('threshold', me.defaultThreshold)
        update('isSignedIn', true)
      })
      return
    }

    // either not logged in or unknown address
    api.private.setToken(null)
    update('followerCount', 0)
    update('myToken', null)
    update('isSignedIn', false)
    update('threshold', null)
    update('messages', [])
  }, [api, isSignedIn2100, ethAddress])


  useEffect( ()=> {
    if (!isSignedIn) return
    updateInbox()
    const id = setInterval(updateInbox,1000)
    return () => clearInterval(id)
  }, [isSignedIn])


  useEffect( ()=> {
    if (!isSignedIn || !myToken) return
    updateFollowerCount(myToken.id)
    const id = setInterval(updateFollowerCount,1000,myToken.id)
    return () => clearInterval(id)
  }, [isSignedIn, myToken, threshold])

  function SendMessage(fmstate){
    return async (message, threshold) => {
      if (!fmstate.myToken) return ["You don't have a token"]
      try {
        message = await fmstate.api.private.call('sendMessage', fmstate.myToken.id, message, threshold)
        update(`messages.${message.id}`, message)
        return [null, message]
      } catch(e){
        return [e.message]
      }

    }
  }

  const contextValue = useMemo(() => {
    const actions = { sendMessage: SendMessage(fmstate) }
    return { ...fmstate, actions }
  }, [fmstate])

  return (
    <FollowMeContext.Provider value={contextValue}>
      {children}
    </FollowMeContext.Provider>
  )
}