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
  const [threshold, setThreshold] = useState("1")
  const [recipientCount, setRecipientCount] = useState(0)

  const hasToken = myToken != null
  const hasFollowers = myToken && followerCount > 0

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
    let newThresh = "1"
    let swappedLevel = 4-level
    const holdings = Object.values(followers)
    if (hasFollowers && 4-level>0){
      const p = percentiles[4-level]
      newThresh = percentile(holdings, p).toString()
    }
    setThreshold(newThresh)
  }, [level, followers])

  useEffect( () => {
    const holdings = Object.values(followers)
    let count = hasFollowers ? holdings.length : 0

    if (threshold != null && threshold !== "1"){
      count = holdings.filter( amount => {
        return BigNumber(amount).gte(threshold)
      }).length
    }

    setRecipientCount(count)

  }, [threshold, followers])

  const tokenRequirement = (
    <div className="small">
      Need {threshold === "1" ? 'some' : toDecimals(threshold,3,1)} ${myTokenName}
    </div>
  )

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
              <div className="text-muted small"><i className='fas fa-eye' /> {recipientCount > 0 && threshold === "1" && 'All'} {recipientCount} holders { hasToken && tokenRequirement }</div>
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