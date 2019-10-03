import React, { useState, useEffect, useMemo } from 'react'
import FollowMeProfileFeed from '../FollowMe/ProfileFeed'

import { Route } from "react-router-dom";
import Allocator from '../Allocator'
import ProfileImage from '../ProfileImage'
import { Link } from 'react-router-dom'
import { toDecimals, weiDecimals } from '../../utils'
import { Redirect }  from 'react-router-dom'
import { useStoreContext } from '../../contexts/Store'
import { useFollowMeContext } from '../../contexts/FollowMe'
import { Button, Form, Col, Row, Card } from 'react-bootstrap'
import Confetti from 'react-confetti'
import ProfileHeader from '../ProfileHeader'
import {get} from 'lodash'
import _BigNumber from 'bignumber.js'
import './style.scss'

function NewUserWelcome({clearNewUser}){
  const [showConfetti, setShowConfetti] = useState(true)

  useEffect(()=>{
    if (showConfetti) return
    clearNewUser()
  },[showConfetti])

  return <Confetti numberOfPieces={200} recycle={false} onConfettiComplete={() => setShowConfetti(false)} />
}

function Description({description, token, isMyToken}){
  const { state, dispatch, actions } = useStoreContext()
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [text, setText] = useState(description)

  function handleEdit(e){
    e.preventDefault()
    setEditing(true)
  }

  async function handlePersist(e){
    e.preventDefault()
    if (saving) return
    setSaving(true)
    const resp = await dispatch(actions.setDescription(token.id, text))
    if (resp) setEditing(false)
    setSaving(false)
  }

  const editButton = description ? null : <Button variant="link" onClick={handleEdit} className='token-description-edit-link'>How do you plan to use your token?</Button>
  const persistButtons = (
    <span>
      <Button className='token-description-edit-save' onClick={handlePersist}>{ saving ? 'Saving' : 'Save'}</Button>
      {!saving && <Button className='token-description-edit-cancel' variant="link" onClick={()=>setEditing(false)}>Cancel</Button>}
    </span>
  )

  return (
    <Form className="token-description" onSubmit={handlePersist}>
      <Form.Group as={Row}>
        {(Boolean(description) || editing) && (
          <Col md="8">
            <Form.Control inline plaintext readOnly={!editing} className='token-description'
            placeholder="I plan to use my token to..." value={description} maxLength="100" className='token-description-edit-input' value={text} onChange={(e) => setText(e.target.value)} onClick={ () => isMyToken && !editing && setEditing(true) }/>
          </Col>)
        }
        <Col md="4">
          {isMyToken ? editing ? persistButtons : editButton : null}
        </Col>
      </Form.Group>
    </Form>
  )
}
/*
Loading states
  0: not connected to the network and loading
  1: connected to the network, but no data yet
  2: connected to the network, data, no token found
  3: connected to the network, data, found token
*/

export default function Profile (props) {

  const { match } = props
  const isNewUser = props.location.state && props.location.state.newuser
  const clearNewUser = () => props.history.replace({ state: {} })

  const [loadingState, setLoadingState] = useState(0)

  const { state, query, dispatch, actions } = useStoreContext()
  const username = match.params.username
  const messageid = match.params.messageid
  const isLoading = query.getIsLoading()
  const isConnected = query.getIsConnected()

  const token = query.getToken(username)

  const fmstate = useFollowMeContext()
  const {tokenFeedMessages} = fmstate
  const [tokenHolders, setTokenHolders] = useState()
  useEffect( () => {
    if (loadingState === 3) return // token exists and loaded
    let id
    if (isConnected && (!token || !token.id)){
      setLoadingState(1)
      id = setTimeout(setLoadingState, 1000, 2) // token doesnt exist
    }
    if (isConnected && token && token.id) setLoadingState(3) // token exists
    return () => clearTimeout(id)
  }, [isConnected, token && token.id])

  useEffect(()=> {
    if (state.network.loading) return
    if (!token || !token.id) return
    dispatch(actions.getTokenHolders(token.id)).then(resp => {
      if (resp) setTokenHolders(resp)
    })
  }, [token && token.id, state.network.loading])

  const info = useMemo(()=> {
    const othersRank = 6
    const amtStaked = toDecimals(token.totalStakes||"0",2,0)

    let stakers = Object.entries(token.stakes || {}).filter(s => new _BigNumber(s[1]).gt(0))
    stakers.sort( (a, b) => new _BigNumber(a[1]).gt(b[1]) ? -1 : 1)

    stakers = stakers.map( ([userid, amount], i) => {
      return {
        rank: i+1,
        name: query.getUserName(userid) || userid,
        value: new _BigNumber(amount).div(weiDecimals).div(100).dp(4,0).toNumber(),
        percent: new _BigNumber(amount).div(token.totalStakes).dp(4,0).toNumber()
      }
    })

    const numStakers = stakers.length
    const created = token.created
    const numPosts = tokenFeedMessages[token.id] ? Object.keys(tokenFeedMessages[token.id] || {}).length : null

    let holders = tokenHolders ? Object.entries(tokenHolders) : []
    const supply = tokenHolders ? _BigNumber.sum(...holders.map(([_,amount])=> amount)) : null
    if (tokenHolders){
      holders = holders.filter(s => new _BigNumber(s[1]).gt(0))
      holders.sort( (a, b) => new _BigNumber(a[1]).gt(b[1]) ? -1 : 1)

      holders = holders.map( ([userid, amount], i) => {
        return {
          rank: i+1,
          name: query.getUserName(userid) || userid,
          value: new _BigNumber(amount).div(weiDecimals).div(100).dp(4,0).toNumber(),
          percent: new _BigNumber(amount).div(supply).dp(4,0).toNumber()
        }
      })
    }

    const numHolders = tokenHolders ? Object.values(holders).length : null

    return {
      amtStaked,
      numStakers,
      created,
      numPosts,
      numHolders,
      supply: tokenHolders ? toDecimals(supply,4) : supply,
      stakers,
      holders
    }
  }, [token, fmstate, tokenHolders])

  if (loadingState==0 || loadingState==1) return <h1>Loading</h1>

  if (loadingState==2) return <h1>${username} is not a token</h1>

  const isSignedIn = query.getIsSignedIn()

  const stakeText = isSignedIn ? <>{toDecimals(token.myStake)} / {toDecimals(token.totalStakes)}</> : toDecimals(token.totalStakes)

  const isMyToken = query.getIsMyToken(token)
  const description = token.description || ''
  const hasDescription = Boolean(description.replace(/\s*/g,''))

  return (
    <div className='profile'>
      {isNewUser && <NewUserWelcome clearNewUser={clearNewUser}/>}
      <span className='context-bar'>
        <Link to='/'><i style={{fontSize: '1.4rem'}} className="fas fa-arrow-circle-left"></i></Link>
      </span>
      <ProfileHeader token={token} info={info} key={token && token.id} />
      <div className='profile-body'>
        <FollowMeProfileFeed token={token} key={token && token.id}/>
      </div>
    </div>
  )
}