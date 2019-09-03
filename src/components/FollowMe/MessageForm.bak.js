import React, {useState, useEffect} from 'react'
import { Form, Button } from 'react-bootstrap'
import {useFollowMeContext} from '../../contexts/FollowMe'
import {useStoreContext} from '../../contexts/Store'

import Dots from '../Dots'
import percentile from '../../utils/percentile'
import {BigNumber, toDecimals, fromDecimals, weiDecimals} from '../../utils'

function isEmpty(message){
  if (!message) return true
  return message.replace(/\s+/, '') === ''
}

const percentiles = [0, 5, 25, 50, 95]

function ThresholdInput({defaultThreshold, onChange = ()=>{}}){
  return <input type='number' step="0.01" min="0" className="threshold-input" defaultValue={defaultThreshold} onChange={ (e) => onChange(e.target.value)} />
}

export default function MessageForm(){
  const {query} = useStoreContext()

  let { api, isSignedIn, myToken, messages = {}, publicMessages = {}, followers = {}, actions } = useFollowMeContext()

  const myTokenName=query.getTokenName(myToken)

  const followerCount = Object.keys(followers).length
  const [submitting, setSubmitting] = useState(false)
  const [showHint, setShowHint] = useState(false)
  const [data, setData] = useState({})
  const { message, hint } = data
  const [error, setError] = useState()
  const [level, setLevel] = useState(0)
  const [threshold, setThreshold] = useState(fromDecimals("0.00021"))
  const [recipientCount, setRecipientCount] = useState(0)

  const hasToken = myToken != null
  const hasFollowers = myToken && followerCount > 0

  const isDisabled = !hasToken || submitting

  const placeholder = !hasToken ? 'Create your token to send messages' : null

  function changeData(e){
    const { id, value } = e.target
    setData({
      ...data,
      [id]: value
    })
  }

  async function handleSend(e){
    e.preventDefault()
    if (isEmpty(message)) return
    setSubmitting(true)
    const resp = await actions.sendMessage(message, hint, threshold.toString())
    console.log('handleSend', resp)
    setSubmitting(false)
    if (resp) {
      setData({})
      setShowHint(false)
    }
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
  let hintInput = null
  if (showHint && hasToken){
    const maxlength = 75
    hintInput = (
      <Form.Group controlId="hint" className='form-group-hint'>
        <Form.Label>
            Visible to everyone:
        </Form.Label>
        <Form.Control as="input" plaintext value={hint || ''} onChange={changeData} disabled={isDisabled ? 'disabled' : null} maxlength={maxlength} />
        <Form.Label className='char-count'>
            {(hint || '').length}/{maxlength}
        </Form.Label>
      </Form.Group>
    )
  }

  function openHint(e){
    e.preventDefault()
    setShowHint(true)
  }

  return (
      <div className='message-form card'>
        <div className='card-body'>
          <Form>
            <Form.Group controlId="message">
              <Form.Control as="textarea" rows="2" value={message || ''} onChange={changeData} disabled={isDisabled ? 'disabled' : null} placeholder={placeholder}/>
              <Form.Text className="text-muted">
                {!hintInput && hasToken && <a href='#' onClick={openHint}>Add a hint</a>}
                {hintInput}
              </Form.Text>
            </Form.Group>

            <div className='clearfix'>
              <div className='float-left'>
                {/*<Dots current={level} onClick={handleSetLevel} isDisabled={isDisabled}/>*/}
                <div className="text-muted small">{ hasToken && tokenRequirement }<i className='fas fa-eye' /> {recipientCount > 0 && recipientCount === followerCount && 'All'} {hasToken && hasFollowers && recipientCount === 0 ? 'Future' : recipientCount} holders</div>
              </div>
              <div className='float-right'>
                <Button variant="primary" disabled={isDisabled || isEmpty(message) ? 'disabled' : null}  onClick={handleSend}>
                  { submitting ? 'Sending' : 'Send' }
                </Button>
              </div>
            </div>
          </Form>
      </div>
    </div>
  )
}