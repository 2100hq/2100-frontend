import React, {
  createContext,
  useContext,
  useMemo,
  useEffect,
  useState,
  useReducer
} from 'react'

import { useFollowMeSocketContext } from '../FollowMeSocket'

import { set,sortBy, keyBy } from 'lodash'
import {useStoreContext} from '../Store'
import { get } from 'lodash'
// import API from './API'

export const FollowMeContext = createContext()

export function useFollowMeContext () {
  return useContext(FollowMeContext)
}

export const FollowMeContextConsumer = FollowMeContext.Consumer

const allowWindowObj = Boolean(process.env.REACT_APP_ALLOW_WINDOW_OBJECT)

function update(state, action, clone=true){
  state = set(state, action.params.path, action.params.data)
  if (!clone) return state
  return { ...state }
}

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
      return update(state,action)
    case 'BATCH_UPDATE':
      const events = action.params.events
      events.forEach( ([path, data]) => {
        const fakeAction = {...action, params: {path, data} }
        state = update(state, fakeAction, false)
      })
      return {...state}
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
    private: {
      messages: {},
    },
    sentMessages: {},
    public: {
      messages: {},
    },
    decodedMessages: {},
    tokenFeedMessages: {},
    followers: {},
    isSignedIn: false,
    // api: {
    //   public:API(followMeUrl,'public'),
    //   private:API(followMeUrl,'private'),
    // },
    showCreate: false
  }
}

function combineMessages(fmstate){
  // return { ...fmstate.public.messages, ...fmstate.decodedMessages, ...fmstate.sentMessages, ...fmstate.private.messages }
  const messagesets = [fmstate.decodedMessages,fmstate.sentMessages,fmstate.private.messages]
  const messages = {...fmstate.public.messages}
  messagesets.forEach( messageset => {
    Object.entries(messageset).forEach( ([id,message]) => {
      const prevMessage = messages[id]
      if (!prevMessage) return messages[id] = message
      const newMessageProps = {}
      newMessageProps.hidden = !prevMessage.hidden || message.hidden
      if (!newMessageProps.hidden){ // can only be hidden if both are hidden; if not hidden find which one is not hidden
        newMessageProps.message = prevMessage.hidden ? message.message : prevMessage.message
      }
      // take the rest of the props from whoever is newer
      const newMessage = prevMessage.updated > message.updated ? {...prevMessage, ...newMessageProps} : {...message, ...newMessageProps}
      messages[id] = newMessage
    })
  })
  return messages
}

export default function FollowMeProvider ({ children }) {
  const socket = useFollowMeSocketContext()
  const { state:appstate, actions, query } = useStoreContext()
  const {followMeUrl, followMePoll} = appstate.config
  const ethAddress = appstate.web3.account
  const myToken = query.getMyToken()
  const [fmstate, dispatch] = useReducer(reducer, InitialState(followMeUrl))
  const { isSignedIn, threshold } = fmstate
  const isSignedIn2100 = appstate.private.isSignedIn
  const authToken2100 = appstate.auth.token
  const update = (path, ...args) => dispatch(actions.update(path, ...args))
  const destroy = path => dispatch(actions.destroy(path))
  const reset = () => dispatch({ type: 'RESET', initalState: { ...InitialState(followMeUrl), public: fmstate.public} } )

  // async function updateInbox(){
  //   try {
  //     let resp = await socket.private('getMyInbox')
  //      update('privateMessages', keyBy(resp, 'id'))
  //   } catch(e){}

  // }

  // async function updatePublicInbox(){
  //   let resp = await api.public.call('feed')
  //   console.log(new Date().toISOString(),'updatePublicInbox done')
  //   // update('publicMessages', keyBy(resp, 'id'))
  // }

  async function updateFollowers(tokenid){
    const followers = await socket.private('followers', tokenid, "0")
    update('followers', followers)
  }

  // hook up socket changes to dispatcher/reducer
  useEffect(() => {
    if (socket.network.loading) return
    socket.listen('public', socketUpdate('public', dispatch))
    socket.listen('private', socketUpdate('private', dispatch))
  }, [socket.network.loading])

  function socketUpdate(channel, dispatch){
    // console.log(channel)
    return events => {
      events = events.map( event => {
        event[0].unshift(channel)
        return event
      })
      // console.log();
      // console.log(events);

      dispatch(actions.batchUpdate(events))
    }
  }


  useEffect( () => {
    // logged in and know address
    if (!isSignedIn && isSignedIn2100 && authToken2100){
      socket.auth('authenticate', authToken2100).then( resp => {
        if (resp) update('isSignedIn', true)
      })
      return
    }
    if (!isSignedIn2100 && !authToken2100){
      if (isSignedIn) socket.auth('unauthenticate')
      // either not logged in or unknown address
      // api.private.setToken(null)
      reset()
    }

  }, [isSignedIn2100, authToken2100])


  // useEffect( ()=> {
  //   if (!isSignedIn || !isSignedIn2100) return
  //   updateInbox()
  //   const id = setInterval(updateInbox,followMePoll)
  //   return () => clearInterval(id)
  // }, [isSignedIn, isSignedIn2100])


  // useEffect( ()=> {
  //   if (!api) return
  //   updatePublicInbox()
  //   // const id = setInterval(updatePublicInbox,followMePoll)
  //   // return () => clearInterval(id)
  // }, [api])


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
        message = await socket.private('sendMessage', {tokenid: myToken.id, message, hint, threshold, type, parentid})
        // if reply, update childCount on all known messages
        if (parentid) {
          const locations = ['private.messages', 'sentMessages', 'public.messages', 'decodedMessages', 'tokenFeedMessages']

          locations.forEach(location => {
            const localMessage = get(fmstate, `${location}.${parentid}`)
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

  function GetMessage(fmstate, channel){
    return async (id) => {
      if (channel == null) channel = fmstate.isSignedIn ? 'private' : 'public'
      try {
        const message = await socket[channel]('getMessage', id)
        return message

      } catch(e){
        console.log(e)
        return null
      }
    }
  }

  function DecodeMessage(fmstate){
    return async (id) => {
      const message = await GetMessage(fmstate)(id)
      if (message) {
        message.decoded = true
        update(`decodedMessages.${message.id}`, message)
      }
      return message
    }
  }

  function GetTokenFeed(fmstate){
    return async (tokenid) => {
      const channel = fmstate.isSignedIn ? 'private' : 'public'
      try {
        destroy(`tokenFeedMessages.${tokenid}`)
        const messages = await socket[channel]('getTokenFeed', tokenid)
        update(`tokenFeedMessages.${tokenid}`, keyBy(messages, 'id'))
      } catch(e){
        return null
      }
    }
  }

  function Destroy(fmstate){
    return async (message) => {
      try {
        const resp = await socket.private('destroy', message.id)
        destroy(`tokenFeedMessages.${message.tokenid}.${message.id}`)
        destroy(`private.messages.${message.id}`)
        destroy(`sentMessages.${message.id}`)
        destroy(`public.messages.${message.id}`)
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
    if (allowWindowObj) window.fmstate = fmstate
    const messages = combineMessages(fmstate)
    return { ...fmstate, myToken, messages, actions, network: socket.network }
  }, [fmstate])

  return (
    <FollowMeContext.Provider value={contextValue}>
      {children}
    </FollowMeContext.Provider>
  )
}