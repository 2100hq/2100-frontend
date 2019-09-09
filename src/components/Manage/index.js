import React, { useState, useEffect } from 'react'
import { Redirect } from 'react-router-dom'
import { Button, Form } from 'react-bootstrap'
import { useStoreContext } from '../../contexts/Store'
import './style.scss'

function content2100(publicAddress){
  return `Add me @2100hq: ${publicAddress}`
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
        Tweet to link your Twitter username to your Ethereum address
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

function StepTwo({gotoStep, publicAddress, tweetType}){
  return (
    <div className='verify'>
    <h5>Verify your Tweet</h5>
    <p className="match-text">Must match "<span>{ tweetType === '2100' ? content2100(publicAddress) : contentHumanityDAO(publicAddress)}</span>"</p>
    <Form.Control as="input" plaintext inline placeholder="https://twitter.com/me/status/123"/>
    <Button>Verify</Button>
    <div>
      <a href="#" className="small text-muted" onClick={ e => {e.preventDefault(); gotoStep(1)}}><i className="fas fa-undo-alt text-muted"></i> I didn't tweeted this</a>
    </div>
    </div>
  )
}

function StepThree({gotoStep, publicAddress, dispatch, actions}){

}

export default function Manage (props) {
  const [username, setUsername] = useState()
  const { state, query, dispatch, actions } = useStoreContext()
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
            {steps[step]({publicAddress, gotoStep,dispatch, actions, setTweetType, tweetType})}
          </div>
        </div>
      </div>
    </div>
  )
}
