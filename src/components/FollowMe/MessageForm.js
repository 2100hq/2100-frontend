import React, {useState, useEffect} from 'react'
import { Form, Button } from 'react-bootstrap'
import {useFollowMeContext} from '../../contexts/FollowMe'
import Dots from '../Dots'
import percentile from '../../utils/percentile'
import {BigNumber, toDecimals, fromDecimals, weiDecimals} from '../../utils'

function isEmpty(message){
  return message.replace(/\s+/, '') === ''
}

const percentiles = [0, 5, 25, 50, 95]

function ThresholdInput({defaultThreshold, onChange = ()=>{}}){
  return <input type='number' step="0.01" min="0" className="threshold-input" defaultValue={defaultThreshold} onChange={ (e) => onChange(e.target.value)} />
}

export default function MessageForm({myTokenName}){
  let { api, isSignedIn, myToken, messages = {}, publicMessages = {}, followers = {}, actions } = useFollowMeContext()

  const followerCount = Object.keys(followers).length
  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState()
  const [level, setLevel] = useState(0)
  const [threshold, setThreshold] = useState(fromDecimals("0.00021"))
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

  function handleSetThreshold(val){
    let newThresh = BigNumber(val).times(weiDecimals)
    if (newThresh.eq(0)){
      newThresh = "1"
    }
    setThreshold(newThresh.toString())
  }

  // function percentileThreshold(){
  //   const holdings = Object.values(followers)
  //   const p = percentiles[4-level]
  //   return percentile(holdings, p).toString()
  // }

  // useEffect( () => {
  //   let newThresh = "1"
  //   let swappedLevel = 4-level
  //   if (hasFollowers && 4-level>0){
  //     newThresh = percentileThreshold()
  //   }
  //   setThreshold(newThresh)
  // }, [level])

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
    <div>
      <ThresholdInput defaultThreshold={toDecimals(threshold,15)} onChange={handleSetThreshold} /> ${myTokenName} required
    </div>
  )

  // function tokenRequirementNumber(){
  //   const defaultThreshold = toDecimals(percentileThreshold(),3,1)
  //   return level === 0 ? <ThresholdInput defaultThreshold={defaultThreshold} onChange={handleSetThreshold} /> : threshold === "1" ? 'some' : defaultThreshold
  // }
  return (
      <div className='message-form card'>
        <div className='card-body'>
          <Form onSubmit={handleSend}>
          <Form.Group controlId="message">
            <Form.Control as="textarea" rows="2" value={message} onChange={changeMessage} disabled={isDisabled ? 'disabled' : null} placeholder={placeholder}/>
          </Form.Group>
          <div className='clearfix'>
            <div className='float-left'>
              {/*<Dots current={level} onClick={handleSetLevel} isDisabled={isDisabled}/>*/}
              <div className="text-muted small">{ hasToken && tokenRequirement }<i className='fas fa-eye' /> {recipientCount > 0 && recipientCount === followerCount && 'All'} {hasToken && hasFollowers && recipientCount === 0 ? 'Future' : recipientCount} holders</div>
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