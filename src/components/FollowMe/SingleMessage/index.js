import React, { useState, useEffect } from 'react'
import useInputState from '../../../utils/hooks/useInputState'
import { useStoreContext } from '../../../contexts/Store'
import { useFollowMeContext } from '../../../contexts/FollowMe'
import MessageCard from '../MessageCard'
import {Form, Row, Col, Container, InputGroup, Button} from 'react-bootstrap'
import ProfileImage from '../../ProfileImage'
import Jazzicon, { jsNumberForAddress } from 'react-jazzicon'
import {isEmpty} from 'lodash'
import ms from 'ms'

import './style.scss'

function Comment({comment, username}){
  const face = username ? <ProfileImage token={username} /> : <Jazzicon diameter={25} seed={jsNumberForAddress(comment.userid)} />
  let message = comment.message
  if (comment.hidden){
    message = (
       <div className='fake-hidden-message'>
         <div className='rectangle r1'></div>
         <div className='rectangle r2'></div>
         <div className='rectangle r3'></div>
       </div>
    )
  }
  return (
    <Container>
      <Row>
        <Col xs="1">
          {face}
        </Col>
        <Col className="comment">
          {message}
          <div className="small text-muted">{ms(Date.now()-comment.created)} ago</div>
        </Col>
      </Row>
    </Container>
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
    <Form onSubmit={handleSubmit}>
     <Form.Group controlId="comment">
        <Row>
          <Col>
            <InputGroup>
              <Form.Control inline as="textarea" rows="1" value={comment || ''} onChange={setComment} disabled={isDisabled ? 'disabled' : null} placeholder={placeholder}/>
              <Button onClick={handleSubmit} disabled={isDisabled || isEmpty(comment)}>Submit{isSubmitting && 'ting'}</Button>
            </InputGroup>
          </Col>
        </Row>
      </Form.Group>
    </Form>
  )
}

function Comments({message, query}){
  let comments = []

  if (message.children){
    comments = message.children.sort( (a, b) => b.created - a.created).map( comment => {
      const username = query.getUserName(comment.userid)
      return (
        <Row>
          <Col>
            <Comment comment={comment} username={username} />
          </Col>
        </Row>
      )
    })
  }

  if (comments.length === 0){
    comments.push(
      <Row>
        <Col>
          Be the first to comment
        </Col>
      </Row>
    )
  }

  return comments
}

export default function SingleMessage(props){
  const { match } = props
  const {messageid, username} = match.params
  const { query, state } = useStoreContext()
  const { myToken, actions, isSignedIn, messages } = useFollowMeContext()
  const [message, setComment] = useState()
  const [loading, setLoading] = useState(true)
  const token = query.getToken(username)
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

  return(
    <Container>
      <Row>
        <Col>
          <MessageCard token={token} myToken={myToken} actions={actions} message={message} isSignedIn={isSignedIn} {...props}/>
        </Col>
      </Row>
      <Comments message={message} query={query} />
      <CommentForm  message={message} onSubmitted={getMessage}/>
    </Container>
  )
}