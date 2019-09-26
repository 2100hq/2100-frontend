import React, { useState, useEffect } from 'react'
import FollowMeProfileFeed from '../FollowMe/ProfileFeed'

import { Route } from "react-router-dom";
import Allocator from '../Allocator'
import ProfileImage from '../ProfileImage'
import { Link } from 'react-router-dom'
import { toDecimals } from '../../utils'
import { Redirect }  from 'react-router-dom'
import { useStoreContext } from '../../contexts/Store'
import { Button, Form, Col, Row, Card } from 'react-bootstrap'
import Confetti from 'react-confetti'
import ProfileHeader from '../ProfileHeader'
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
    <Form class="token-description" onSubmit={handlePersist}>
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

  const { query } = useStoreContext()
  const username = match.params.username
  const messageid = match.params.messageid
  const isLoading = query.getIsLoading()
  const isConnected = query.getIsConnected()

  const token = query.getToken(username)

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
      <span className='back-button'>
        <Link to='/'><i class="fas fa-arrow-circle-left"></i></Link> Profile
      </span>
      <ProfileHeader token={token} />
      <div className='profile-body'>
        <FollowMeProfileFeed token={token} />
      </div>
    </div>
  )
}