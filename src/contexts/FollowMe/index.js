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
import { get } from 'lodash'
import API from './API'

export const FollowMeContext = createContext()

export function useFollowMeContext () {
  return useContext(FollowMeContext)
}

export const FollowMeContextConsumer = FollowMeContext.Consumer

function reducer (state, action) {
  switch (action.type) {
    case 'RESET':
      return action.initalState
    case 'UPDATE':
      if (action.params.path.split('.').length == 2){
        const [_root, _id] = action.params.path.split('.')
        action.params.data = { ...set(get(state, _root), _id, action.params.data) }
        action.params.path = _root
      }
      return { ...set(state, action.params.path, action.params.data) }
    case 'DESTROY':
      const paths = action.params.path.split('.')
      const id = paths[paths.length - 1]
      const _root = paths.slice(0,paths.length-1).join('.')
      let data = { ...get(state, _root) }
      delete data[id]
      return { ...set(state, _root, data) }
    default:
      throw new Error(`Reducer does not handle ${action.type}`)
  }
}

function InitialState(followMeUrl){
  return {
    privateMessages: {},
    sentMessages: {},
    publicMessages: {},
    decodedMessages: {},
    tokenFeedMessages: {},
    followers: {},
    isSignedIn: false,
    api: {
      public:API(followMeUrl,'public'),
      private:API(followMeUrl,'private'),
    },
    showCreate: false
  }
}

export default function FollowMeProvider ({ children }) {
  const { state:appstate, actions, query } = useStoreContext()
  const {followMeUrl, followMePoll} = appstate.config
  const ethAddress = appstate.web3.account
  const myToken = query.getMyToken()
  const [fmstate, dispatch] = useReducer(reducer, InitialState(followMeUrl))
  const { api,isSignedIn, threshold } = fmstate
  const isSignedIn2100 = appstate.private.isSignedIn
  const authToken2100 = appstate.auth.token
  const update = (path, ...args) => dispatch(actions.update(path, ...args))
  const destroy = path => dispatch(actions.destroy(path))
  const reset = () => dispatch({ type: 'RESET', initalState: { ...InitialState(followMeUrl), publicMessages: fmstate.publicMessages} } )

  async function updateInbox(){
    try {
      let resp = await api.private.call('getMyInbox')
       update('privateMessages', keyBy(resp, 'id'))
    } catch(e){}

  }

  async function updatePublicInbox(){
    let resp = await api.public.call('feed')
    update('publicMessages', keyBy(resp, 'id'))
  }

  async function updateFollowers(tokenid){
    const followers = await api.private.call('followers', tokenid, "0")
    update('followers', followers)
  }

  useEffect( () => {
    // logged in and know address
    if (!isSignedIn && isSignedIn2100 && authToken2100){
      api.private.setToken(authToken2100)
      api.private.call('me').then( async (me) => {
        update('threshold', me.defaultThreshold)
        update('isSignedIn', true)
      })
      return
    }
    if (!isSignedIn2100 && !authToken2100){
      // either not logged in or unknown address
      api.private.setToken(null)
      reset()
    }

  }, [isSignedIn2100, authToken2100])


  useEffect( ()=> {
    if (!isSignedIn || !isSignedIn2100) return
    updateInbox()
    const id = setInterval(updateInbox,followMePoll)
    return () => clearInterval(id)
  }, [isSignedIn, isSignedIn2100])


  useEffect( ()=> {
    if (!api) return
    updatePublicInbox()
    const id = setInterval(updatePublicInbox,followMePoll)
    return () => clearInterval(id)
  }, [api])


  useEffect( ()=> {
    if (!isSignedIn || !myToken || !isSignedIn2100) return
    updateFollowers(myToken.id)
    const id = setInterval(updateFollowers,followMePoll,myToken.id)
    return () => clearInterval(id)
  }, [isSignedIn, myToken, isSignedIn2100])

  function SendMessage(fmstate){
    return async ({message, hint, threshold, type, parentid}) => {
      if (!myToken) return null

      try {
        message = await fmstate.api.private.call('sendMessage', {tokenid: myToken.id, message, hint, threshold, type, parentid})

        // if reply, update childCount on all known messages
        if (parentid) {
          const locations = ['privateMessages', 'sentMessages', 'publicMessages', 'decodedMessages', 'tokenFeedMessages']

          locations.forEach(location => {
            const localMessage = get(fmstate, [location,parentid])
            if (!localMessage) return
            update(`${location}.${parentid}.childCount`, (localMessage.childCount || 0) + 1)
          })
        } else {
          update(`sentMessages.${message.id}`, message) // this isn't a comment
        }

        return message

      } catch(e){
        return null
      }

    }
  }

  function GetMessage(fmstate){
    return async (id) => {
      const channel = fmstate.isSignedIn ? 'private' : 'public'
      try {
        const message = await fmstate.api[channel].call('getMessage', id)
        return message

      } catch(e){
        return null
      }
    }
  }

  function DecodeMessage(fmstate){
    return async (id) => {
      const message = await GetMessage(fmstate)(id)
      message.decoded = true
      if (message) update(`decodedMessages.${message.id}`, message)
      return message
    }
  }

  function GetTokenFeed(fmstate){
    return async (tokenid) => {
      const channel = fmstate.isSignedIn ? 'private' : 'public'
      try {
        destroy(`tokenFeedMessages.${tokenid}`)
        const messages = await fmstate.api[channel].call('getTokenFeed', tokenid)
        update(`tokenFeedMessages.${tokenid}`, keyBy(messages, 'id'))
      } catch(e){
        return null
      }
    }
  }

  function Destroy(fmstate){
    return async (message) => {
      try {
        const resp = await fmstate.api.private.call('destroy', message.id)
        destroy(`tokenFeedMessages.${message.tokenid}.${message.id}`)
        destroy(`privateMessages.${message.id}`)
        destroy(`sentMessages.${message.id}`)
        destroy(`publicMessages.${message.id}`)
        destroy(`decodedMessages.${message.id}`)
        return true
      } catch(e){
        return null
      }
    }
  }

  const contextValue = useMemo(() => {
    const actions = {
      sendMessage: SendMessage(fmstate),
      getMessage: GetMessage(fmstate),
      decodeMessage: DecodeMessage(fmstate),
      getTokenFeed: GetTokenFeed(fmstate),
      destroy: Destroy(fmstate),
      setShowCreate: show => update('showCreate', show)
    }
    window.fmstate = fmstate
    const messages = { ...fmstate.publicMessages, ...fmstate.decodedMessages, ...fmstate.sentMessages, ...fmstate.privateMessages }
    return { ...fmstate, myToken, messages, actions }
  }, [fmstate])

  return (
    <FollowMeContext.Provider value={contextValue}>
      {children}
    </FollowMeContext.Provider>
  )
}