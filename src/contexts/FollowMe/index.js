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
    case 'RESET':
      return action.initalState
    case 'UPDATE':
      // console.log(action.params.path, action.params.data)
      return { ...set(state, action.params.path, action.params.data) }
    default:
      throw new Error(`Reducer does not handle ${action.type}`)
  }
}

function InitialState(followMeUrl){
  return {
    messages: {},
    publicMessages: {},
    decodedMessages: {},
    followers: {},
    isSignedIn: false,
    api: {
      public:API(followMeUrl,'public'),
      private:API(followMeUrl,'private'),
    }
  }
}

export default function FollowMeProvider ({ children }) {
  const { state:appstate, actions } = useStoreContext()
  const {followMeUrl, followMePoll} = appstate.config
  const ethAddress = appstate.web3.account

  const [fmstate, dispatch] = useReducer(reducer, InitialState(followMeUrl))
  const { api,isSignedIn, myToken, threshold } = fmstate
  const isSignedIn2100 = appstate.private.isSignedIn

  const update = (path, ...args) => dispatch(actions.update(path, ...args))
  const reset = () => dispatch({ type: 'RESET', initalState: InitialState(followMeUrl)})

  async function updateInbox(){
    try {
      let resp = await api.private.call('getMyInbox')
       update('messages', keyBy(resp, 'id'))
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
    reset()
  }, [isSignedIn2100, ethAddress])


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
    return async (message, threshold) => {
      if (!fmstate.myToken) return null
      try {
        message = await fmstate.api.private.call('sendMessage', fmstate.myToken.id, message, threshold)
        update(`messages.${message.id}`, message)
        return message
      } catch(e){
        return null
      }

    }
  }

  function GetMessage(fmstate){
    return async (id) => {
      if (!fmstate.isSignedIn) return null
      try {
        const message = await fmstate.api.private.call('getMessage', id)
        update(`decodedMessages.${message.id}`, message)
        return message
      } catch(e){
        return null
      }
    }
  }

  const contextValue = useMemo(() => {
    const actions = { sendMessage: SendMessage(fmstate), getMessage: GetMessage(fmstate) }
    return { ...fmstate, actions }
  }, [fmstate])

  return (
    <FollowMeContext.Provider value={contextValue}>
      {children}
    </FollowMeContext.Provider>
  )
}