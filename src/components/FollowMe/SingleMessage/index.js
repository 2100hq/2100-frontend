import React, { useState, useEffect } from 'react'
import useInputState from '../../../utils/hooks/useInputState'
import clickHandler from '../../../utils/clickHandler'
import { useStoreContext } from '../../../contexts/Store'
import { numberSuffix } from '../../../utils'
import { useFollowMeContext } from '../../../contexts/FollowMe'
import MessageCard from '../MessageCard'
import {Form, Row, Col, Container, InputGroup, Button} from 'react-bootstrap'
import ProfileImage from '../../ProfileImage'
import LinkableName from '../../LinkableName'
import Jazzicon, { jsNumberForAddress } from 'react-jazzicon'
import {isEmpty} from 'lodash'
import ms from 'ms'
import * as linkify from "linkifyjs";
import Linkify from "linkifyjs/react";

import './style.scss'

const oneminute = ms('1m')
function Destroy({comment, onDestroying=()=>{}, onDestroyed=()=>{}}){
  const {actions, isSignedIn} = useFollowMeContext()
  const {query} = useStoreContext()
  const [destroyCountDown, setDestroyCountDown] = useState(null)

  useEffect( ()=>{
    onDestroying(destroyCountDown!=null)
    if (destroyCountDown == null) return
    const id = destroyCountDown > 0 ? setTimeout(setDestroyCountDown, 1000, destroyCountDown-1) : setTimeout( () => actions.destroy(comment).then( resp => {
      if (resp){
        onDestroyed()
      }
      setDestroyCountDown(null)
    }), 1000)
    return () => clearTimeout(id)
  }, [destroyCountDown])

  if (comment.hidden) return null // can't delete if hidden

  if (comment.userid.toLowerCase() !== query.getUserAddress().toLowerCase() || !isSignedIn) return null

  function destroyMessage(){
    if (destroyCountDown == null) return setDestroyCountDown(3)
    setDestroyCountDown(null)
  }

  return (
    <a href="#" onClick={clickHandler(destroyMessage)} className='message-delete'>
      { destroyCountDown == null ? <i className="fas fa-times"></i> : destroyCountDown <= 0 ? <i className="fas fa-circle destroying"></i> : <span>{destroyCountDown} <span className='small text-muted'>(cancel)</span></span> }
    </a>
  )
}

function Comment({comment, username, onDestroyed=()=>{}, displayUsername = true}){
  const [isDestroying, setIsDestroying] = useState(false)
  const face = username ? <ProfileImage token={username} /> : <Jazzicon diameter={25} seed={jsNumberForAddress(comment.userid)} />
  const name = username
  let message = comment.message
  if (comment.hidden){
    message = (
       <div className='fake-hidden-message'>
         <div className='rectangle r1'></div>
       </div>
    )
  }

  let elapsed = Date.now()-comment.created
  elapsed = elapsed < oneminute ? 'now' : ms(elapsed)

  const classNames = ["comment"]
  if (isDestroying) classNames.push('message-destroy-countdown')

  return (
    <div className={classNames.join(' ')}>
      <Destroy comment={comment} onDestroying={setIsDestroying} onDestroyed={onDestroyed}/>
      <Row className='align-items-center justify-content-center'>
      <Col md='1' className='single-comment-profile'>
        {face}
      </Col>
      <Col md='10' className='single-comment-row'>
        <div className='single-comment speech-bubble'>
          <div className='single-comment-header'>
          {displayUsername && <LinkableName name={name} className='username' />}
          </div>
          <div className='single-comment-body'><Linkify>{message}</Linkify></div>
          <span className='ago text-muted'>{elapsed}</span>
        </div>
      </Col>
      </Row>
    </div>
  )
}

function CommentForm({message, onSubmitted}){
  const { actions, isSignedIn } = useFollowMeContext()
  const [isSubmitting, setSubmitting] = useState(false)
  const [comment, setComment] = useInputState()
  const isDisabled = message.hidden || isSubmitting
  const placeholder = isSignedIn ? message.hidden ? "Decode this message to comment" : "" : "Sign in to comments"

  async function handleSubmit(e){
    e.preventDefault()
    if (isEmpty(comment)) return
    setSubmitting(true)
    const resp = await actions.sendMessage({message:comment, parentid: message.id})
    setSubmitting(false)
    if (resp) {
      setComment("")
      onSubmitted && onSubmitted(resp)
    }
  }

  return (
      <Row className='comment-form-area no-gutters justify-content-center align-items-center'>
        <Col md='8'>
        <Form onSubmit={handleSubmit}>
         <Form.Group controlId="comment">
          <InputGroup>
            <Form.Control inline as="input" rows="1" value={comment || ''} onChange={setComment} disabled={isDisabled ? 'disabled' : null} placeholder={placeholder}/>
            <div className='custom-submit' onClick={handleSubmit} disabled={isDisabled || isEmpty(comment)}><i class="fas fa-arrow-up"></i>{isSubmitting && 'ting'}</div>
          </InputGroup>
          </Form.Group>
        </Form>
        </Col>
      </Row>
  )
}

function getSystemComments(message,query){
  return (message.recipientTimestamps || []).map( (data, i) =>{
    data = {...data}
    const username = query.getUserName(data.userid)
    const suffix = numberSuffix(i+1)
    data.isSystemComment = true
    data.message = <React.Fragment><LinkableName name={username} /> was {i+1}{suffix} to decode this message</React.Fragment>
    data.hidden = false
    data.userid='system'
    return data
  })
}

function Comments({message, query, onDestroyed}){
  if (!message.children) message.children = []

  const recipientTimestamps = getSystemComments(message,query)

  let comments = (message.children).concat(recipientTimestamps).sort( (a, b) => a.created - b.created).map( comment => {
    const username = comment.isSystemComment ? '2100hq' : query.getUserName(comment.userid)
    return (
      <Comment comment={comment} username={username} onDestroyed={onDestroyed} displayUsername={!comment.isSystemComment}/>
    )
  })

  if (comments.length === 0){
    comments.push(
      <div style={{padding: '2rem'}}>Be the first to comment</div>
    )
  }

  return comments
}

function notificationsByParentId(notifications,parentid){
  return Object.values(notifications).filter( notification => notification.parentid === parentid)
}

export default function SingleMessage(props){
  const {messageid, token} = props
  const { query, state } = useStoreContext()
  const { myToken, actions, isSignedIn, messages, private: {decodedMessages = {}, notifications={}}, network } = useFollowMeContext()
  const [message, setMessage] = useState()
  const [loading, setLoading] = useState(true)
  const [seenNotifications, setSeenNotifications] = useState(notificationsByParentId(notifications,messageid))

  function getMessage(){
    if (network.loading) return
    actions.getMessage(messageid).then( result => {
      if (!result) return // error message?
      setMessage(result)
      if (loading) setLoading(false)
    })
  }

  useEffect(getMessage, [network.loading, isSignedIn, decodedMessages[messageid]])

  useEffect(() => {
    const newNotifications = Object.values(notifications).filter( notification => {
      if (notification.parentid !== messageid) return false
      if (seenNotifications.includes(notification.id)) return false
      return true
    })
    if (newNotifications.length > 0){
      setSeenNotifications([...seenNotifications, ...newNotifications])
      getMessage()
    }


  },[Object.keys(notifications).join('')])

  // if message is cached, get it
  useEffect( () => {
    if (!messages[messageid] || !loading) return
     setMessage(messages[messageid])
  }, [])

  if (!message) return null

  return(
    <div className='single-message'>
      <MessageCard token={token} myToken={myToken} actions={actions} message={message} isSignedIn={isSignedIn} {...props}/>
      <Comments message={message} query={query} onDestroyed={getMessage}/>
      <CommentForm message={message} onSubmitted={getMessage}/>
    </div>
  )
}