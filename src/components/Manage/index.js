import React, { useState, useEffect } from 'react'
import { Redirect } from 'react-router-dom'
import { Button, Form } from 'react-bootstrap'
import { useStoreContext } from '../../contexts/Store'
import {get} from 'lodash'
import './style.scss'

function content2100(publicAddress){
  return `Add me to @2100hq using the Ethereum address ${publicAddress}`
}

function contentHumanityDAO(publicAddress){
  return `I'm applying to the @HumanityDAO registry! My Ethereum address is ${publicAddress}`
}


function StepOne({gotoStep, publicAddress, setTweetType}){
  const tweet = content2100(publicAddress)
  function postTweet(){
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweet)}`,
      null,
      'width=500,height=400',
    )
    gotoStep(2)
  }
  return (
    <div className='start'>
      <h5>Get on the leaderboard</h5>
      <p>
        Tweet this to claim your username
      </p>
      <div>
        <div className='tweet-content'>{tweet}</div>
        <Button className='tweet-button' onClick={postTweet}>Tweet</Button>
      </div>
      <div className='already'>
        <div className='already-tweeted'>
          <a href="#" className="small text-muted" onClick={ e => {e.preventDefault(); setTweetType('2100'); gotoStep(2)}}><i className="far fa-check-circle already-tweeted-logo text-muted"></i> I already tweeted</a>
        </div>
        <div className='already-humanitydao'>
          <a href="#" className="small text-muted" onClick={ e => {e.preventDefault();  setTweetType('humanitydao'); gotoStep(2)}}><img src="https://www.humanitydao.org/static/media/logo.d37c0cc9.svg" className='humanitydao-logo'/> I'm part of Humanity DAO</a>
        </div>
       </div>
    </div>
  )
}

function StepTwo({gotoStep, publicAddress,tweetType}){
  const { state, query, dispatch, actions } = useStoreContext()
  const [link, setLink] = useState()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [commandId, setCommandId] = useState()
  const [verifiedName, setVerifiedName] = useState(false)
  const myCommand = get(state, `private.myCommands.${commandId}`, {id: '', done: false })

  useEffect(() => {
    if (commandId == null) {
      return
    }
    if (!myCommand.done) return

    setCommandId(null)
    setVerifiedName(myCommand.name)
    setIsSubmitting(false)
  }, [myCommand.done, commandId])


  const isDisabled = !/^https:\/\/twitter\.com\/\w+\/status\/\d+/i.test(link || '') || isSubmitting
  async function handleSubmit(){
    setIsSubmitting(true)
    const resp = await dispatch(actions.verifyTwitter({link, tweetType}))
    console.log('verifyTweet', resp)
    if (resp) {
      setCommandId(resp.id)
    } else {
      setIsSubmitting(false)
    }

  }
  function handleInput(e){
    setLink(e.target.value)
  }

  if (verifiedName) return <Redirect to={{pathname: `/$${verifiedName}`, state: { newuser: true }}} />

  return (
    <div className='verify'>
    <h5>Link your username</h5>
    <p>Paste a link to your tweet.</p>
    <Form.Control as="input" plaintext inline placeholder="https://twitter.com/me/status/123" onChange={handleInput}/>
    <Button onClick={handleSubmit} disabled={isDisabled}>Submit{isSubmitting && 'ting'}</Button>
    <div>
      <p className='small text-muted'>Your tweet must match "<span className='match-text'>{ tweetType === '2100' ? content2100(publicAddress) : contentHumanityDAO(publicAddress)}</span>"</p>
      <a href="#" className="small text-muted" onClick={ e => {e.preventDefault(); gotoStep(1)}}><i className="fas fa-undo-alt text-muted"></i> I didn't tweeted this</a>
    </div>
    </div>
  )
}

function StepThree({gotoStep, publicAddress, dispatch, actions}){

}

export default function Manage (props) {
  const { state, query } = useStoreContext()
  const [username, setUsername] = useState()
  const [tweetType, setTweetType] = useState('2100')
  const [step, setStep] = useState(1)
  if (!state.private.isSignedIn) return <Redirect to={{
      pathname: '/',
      state: { from: props.location }
    }} />

  const publicAddress = query.getUserAddress()

  const steps = {
    [1]: (props) => <StepOne {...props} />,
    [2]: (props) => <StepTwo {...props} />,
    [3]: (props) => <StepThree {...props} />
  }

  function gotoStep(gotoStep=1){
    if (gotoStep > Object.keys(steps).length) gotoStep = 1
    setStep(gotoStep)
  }
  return (
    <div className='row'>
      <div className=''>
        <div className='card create-token'>
          <div className='card-body'>
            {steps[step]({publicAddress, gotoStep, setTweetType, tweetType})}
          </div>
        </div>
      </div>
    </div>
  )
}
