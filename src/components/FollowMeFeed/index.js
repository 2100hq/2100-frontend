import React, {useState, useEffect} from 'react'
import {useFollowMeContext} from '../../contexts/FollowMe'
import {useStoreContext} from '../../contexts/Store'
import {get, sortBy} from 'lodash'
import { Form, Button } from 'react-bootstrap'

function getUserName(state, tokenid){
  const token = get(state, `public.tokens.active.${tokenid}`)
  if (get(state, 'private.me.id').toLowerCase() === token.ownerAddress.toLowerCase()) return 'You'
  return '$'+token.name
}

function isEmpty(message){
  return message.replace(/\s+/, '') === ''
}

export default function FollowMeFeed(){
  const {state} = useStoreContext()
  let { api, isSignedIn, myToken, messages = {}, followers = {}, actions } = useFollowMeContext()
  const followerCount = Object.keys(followers).length
  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState()
  messages = Object.values(sortBy(messages, msg => msg.created * -1))

  function changeMessage(e){
    setMessage(e.target.value)
  }

  async function handleSend(e){
    e.preventDefault()
    if (isEmpty(message)) return
    setSubmitting(true)
    const [err] = await actions.sendMessage(message, 0.00001)
    setSubmitting(false)
    if (!err) setMessage('')
    if (err) setError(err)
  }

  return (
    <div>
      <div className='card'>
        <div className='card-body'>
        {messages.map( message => <p key={message.id}>{getUserName(state, message.tokenid)} said: {message.message}</p>)}
        <hr />
        <Form onSubmit={handleSend}>
          <Form.Group controlId="message">
            <Form.Control as="textarea" rows="3" value={message} onChange={changeMessage}/>
            <Form.Text className="text-muted">
              {followerCount} holders will see this message
            </Form.Text>
          </Form.Group>
          <Button variant="primary" type="submit" disabled={isEmpty(message) || submitting ? 'disabled' : null}>
            { submitting ? 'Sending' : 'Send' }
          </Button>
        </Form>
        </div>
      </div>
    </div>
  )
}