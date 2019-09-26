import React, { useState, useEffect } from 'react'
import useInputState from '../../../utils/hooks/useInputState'
import clickHandler from '../../../utils/clickHandler'
import { useStoreContext } from '../../../contexts/Store'
import { useFollowMeContext } from '../../../contexts/FollowMe'
import MessageCard from '../MessageCard'
import {Form, Row, Col, Container, InputGroup, Button} from 'react-bootstrap'
import ProfileImage from '../../ProfileImage'
import Jazzicon, { jsNumberForAddress } from 'react-jazzicon'
import {isEmpty} from 'lodash'
import ms from 'ms'

import './style.scss'

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

function Comment({comment, username, onDestroyed}){
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
          <span className='username'>${name}</span>
          </div>
          <div className='single-comment-body'>{message}</div>
          <span className='ago text-muted'>{ms(Date.now()-comment.created)}</span>
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
    <Row className='comment-form'>
      <Col md='12'>
      <Form onSubmit={handleSubmit}>
       <Form.Group controlId="comment">
        <InputGroup>
          <Form.Control inline as="textarea" rows="1" value={comment || ''} onChange={setComment} disabled={isDisabled ? 'disabled' : null} placeholder={placeholder}/>
          <InputGroup.Append>
          <Button onClick={handleSubmit} disabled={isDisabled || isEmpty(comment)}>Send{isSubmitting && 'ting'}</Button>
          </InputGroup.Append>
        </InputGroup>
        </Form.Group>
      </Form>
      </Col>
    </Row>
  )
}

function Comments({message, query, onDestroyed}){
  let comments = []

  if (message.children){
    comments = message.children.sort( (a, b) => a.created - b.created).map( comment => {
      const username = query.getUserName(comment.userid)
      return (
        <Comment comment={comment} username={username} onDestroyed={onDestroyed} />
      )
    })
  }

  if (comments.length === 0){
    comments.push(
      <div style={{padding: '2rem'}}>Be the first to comment</div>
    )
  }

  return comments
}

export default function SingleMessage(props){
  const {messageid, token} = props
  const { query, state } = useStoreContext()
  const { myToken, actions, isSignedIn, messages } = useFollowMeContext()
  const [message, setComment] = useState()
  const [loading, setLoading] = useState(true)
  function getMessage(){
    actions.getMessage(messageid).then( result => {
      if (!result) return // error message?
      setComment(result)
      if (loading) setLoading(false)
    })
  }
  useEffect(() => {
    getMessage()
    const id = setTimeout(getMessage, state.config.followMePoll)
    return () => clearTimeout(id)
  },[isSignedIn]) // when create window closes, fetch

  // if message is cached, get it
  useEffect( () => {
    if (!messages[messageid] || !loading) return
     setComment(messages[messageid])
  }, [])

  if (!message) return null
  console.log();
  console.log(message);

  return(
    <div className='single-message'>
      <MessageCard token={token} myToken={myToken} actions={actions} message={message} isSignedIn={isSignedIn} {...props}/>
      <Comments message={message} query={query} onDestroyed={getMessage}/>
      <CommentForm message={message} onSubmitted={getMessage}/>
    </div>
  )
}