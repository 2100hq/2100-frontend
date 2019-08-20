import React, {useState, useEffect} from 'react'
import { Form, Button } from 'react-bootstrap'
import {useFollowMeContext} from '../../contexts/FollowMe'
import Dots from '../Dots'
import percentile from '../../utils/percentile'
import {BigNumber, toDecimals} from '../../utils'

function isEmpty(message){
  return message.replace(/\s+/, '') === ''
}

const percentiles = [0, 5, 25, 50, 95]

export default function MessageForm({myTokenName}){
  let { api, isSignedIn, myToken, messages = {}, publicMessages = {}, followers = {}, actions } = useFollowMeContext()

  const followerCount = Object.keys(followers).length
  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState()
  const [level, setLevel] = useState(4)
  const [threshold, setThreshold] = useState()
  const [recipientCount, setRecipientCount] = useState(0)

  const hasToken = myToken != null
  const isDisabled = !hasToken || submitting

  const placeholder = !hasToken ? 'Create your token to send messages' : null

  function changeMessage(e){
    setMessage(e.target.value)
  }

  async function handleSend(e){
    e.preventDefault()
    if (isEmpty(message)) return
    setSubmitting(true)
    const resp = await actions.sendMessage(message, threshold)
    setSubmitting(false)
    if (resp) setMessage('')

  }

  function handleSetLevel(i){
    setLevel(Number(i))
  }

  useEffect( () => {
    const holdings = Object.values(followers)
    const p = percentiles[level]
    const newThresh = percentile(holdings, p)
    setThreshold(newThresh.toString())
    setRecipientCount(holdings.filter( amount => {
      return BigNumber(amount).gte(threshold)
    }).length)
  }, [level, followers])

  return (
      <div className='card'>
        <div className='card-body'>
          <Form onSubmit={handleSend}>
          <Form.Group controlId="message">
            <Form.Control as="textarea" rows="2" value={message} onChange={changeMessage} disabled={isDisabled ? 'disabled' : null} placeholder={placeholder}/>
          </Form.Group>
          <div className='clearfix'>
            <div className='float-left'>
              <Dots current={level} onClick={handleSetLevel} isDisabled={isDisabled}/>
              <div className="text-muted small"><i className='fas fa-eye' /> {recipientCount} holders { hasToken && `(${toDecimals(threshold,3,1)} $${myTokenName})`}</div>
            </div>
            <div className='float-right'>
              <Button variant="primary" type="submit" disabled={isDisabled || isEmpty(message) ? 'disabled' : null}>
                { submitting ? 'Sending' : 'Send' }
              </Button>
            </div>
          </div>
        </Form>
      </div>
    </div>
  )
}