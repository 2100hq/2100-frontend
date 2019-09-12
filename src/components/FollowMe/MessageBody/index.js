import React, {useState, useEffect } from 'react'
import {get, shuffle} from 'lodash'
import { BigNumber, toDecimals, weiDecimals } from '../../../utils'
import ms from 'ms'
import * as linkify from 'linkifyjs';
import Linkify from 'linkifyjs/react';
import YouTube from 'react-youtube';
import { TwitterTweetEmbed } from 'react-twitter-embed';
import { Row, Col } from 'react-bootstrap'
import './style.scss'
const nodeURL = require('url');

function CharReveal({encrypted,decrypted,length,reveal}){

  const [step, setStep] = useState(-1)

  const [shuffled] = useState(
    shuffle([...Array(length).keys()])
  )
  const [randStart] = useState(Math.floor(Math.random()*100))
  if (decrypted === 'priv2') console.log(step, length, shuffled,shuffled.length)
  useEffect( () => {
    if (decrypted === 'priv2') console.log('effect')
    if (!reveal) return
    if (step >= shuffled.length) return
    if (step === -1) {
      setTimeout(setStep,randStart,step+1)
      return
    }
    setTimeout(setStep,10,step+1)
    return
  },[reveal, step])
// if (decrypted !== 'priv2') return null
  const encLength = encrypted.length
  const message = []

  return decrypted.split('').map( (char, i) => {
    const j = i % encLength
    console.log(char, i)
    if (/\s/.test(char)){
      console.log('found space')
      return char
    }
    console.log('current step',step)
    if (step === -1) return encrypted[j]
    for (let s = 0; s < step+1; s++){
      console.log(shuffled[s] === i,shuffled,s,shuffled[s],i,decrypted[i])
      if (shuffled[s] === i) return decrypted[i]
    }
    return encrypted[j]
  }).join('')
  //

  // const [intervalId, setIntervalId] = useState()

  // const nextStepTimeout = 0
  // useEffect( () => {
  //   if (!reveal) return
  //   if (step >= 2) return
  //   if (step === 0) {
  //     setTimeout(setStep,randStart,step+1)
  //     return
  //   }
  //   setTimeout(setStep,nextStepTimeout,step+1)
  //   return
  // },[reveal, step])
  // return (
  //   <span className={`char-reveal step-${step}`}>
  //     <span className='decrypted'>{decrypted}</span>
  //     <span className='encrypted'>{encrypted}</span>
  //   </span>
  // )
}

function InvisibleSubtext({name, token, message, isSignedIn, actions}){
  /* 4 states
   - Not signed in
   - Signed in, not staking
   - Signed in, staking (not able to decode)
   - Signed in, able to decode
  */
  const [decoding, setDecoding] = useState(false)

  if (!isSignedIn) return <span><i className='fas fa-lock' /> hold <span style={{fontWeight: 'bold'}}>{toDecimals(message.threshold,3,0)} ${name} </span>to decode</span>

  const available = get(token, 'balances.available', "0")
  const diff = BigNumber(message.threshold).minus(available)
  const isStaking = BigNumber(token.myStake).gt(0)
  let timeToDecode = null

  async function decodeMessage(id){
    setDecoding(true)
    const resp = await actions.decodeMessage(id)
    setDecoding(false)
  }

  function handleClick(e){
    e.preventDefault()
    decodeMessage(message.id)
  }

  if (isStaking && diff.gt(0)){
    const divisor = BigNumber(token.myStake).div(token.totalStakes).times(0.9).times(0.00021).times(weiDecimals)
    const blocks = diff.div(divisor).dp(0,0).toNumber()
    timeToDecode = (<span>({ms(blocks*15000)} to go)</span>)
  }



  if (diff.gt(0) && isStaking) return <span><i class="fas fa-asterisk"></i> getting {toDecimals(diff, 3, 0)} <span className='token-name'>{name}</span> {timeToDecode}</span>

  if (decoding) return <span><i class="fas fa-exclamation"></i> decoding...</span>

  if (diff.lte(0)) return <span><i class="fas fa-exclamation"></i> you have enough <span className='token-name'>{name}</span> to <a href="#" onClick={handleClick}>decode</a></span>

  if (!isStaking) return <span><i className='fas fa-lock' /> hold {toDecimals(message.threshold,3,0)} <span className='token-name'>{name} to see</span></span>
}

function EncryptedMessage({encrypted, decrypted}){
  if (encrypted === decrypted) return encrypted
  const encLengh = encrypted.length
  return decrypted.split('').map( (char, i) => {
    const j = i % encLengh
    if (/\s/.test(char)) return char
    return encrypted[j]
  }).join('')
}

function DecryptedMessage({decrypted}){
   let delay = 750
   const [step, setStep] = useState(1)
   const gifs = ['https://media.giphy.com/media/wcjtdRkYDK0sU/giphy.gif', 'https://media.giphy.com/media/VGuAZNdkPUpEY/giphy.gif']
   const [gifIndex] = useState(Math.floor(Math.random()*gifs.length))
   useEffect( () => {
     if (step >= 2) return
     setTimeout(setStep,delay,step+1)
     return
   },[step])
   if (step === 1) return <img className='decoding' src={gifs[gifIndex]} />
   return decrypted
}

function HiddenMessage({message}){
  const encrypted = message.id.replace(/-/g,'').toUpperCase().split('')
  let decrypted = !message.message ? encrypted : message.message // if hidden message text sent by server is null or ''
  return(
    <div className='hidden-message-block'>
        <div className='pretend-encryption'>
        <EncryptedMessage {...{encrypted, decrypted}} />
      </div>
    </div>
  )
}

function MessageIcon({message}){
  switch(message.type) {
    case 'image':
      return <i className={'fas fa-image'} />
    case 'imgur':
      return <i className={'fas fa-image'} />
    case 'video':
      return <i className={'fas fa-video'} />
    case 'youtube':
      return <i className={'fab fa-youtube'} />
    case 'twitter':
      return <i className={'fab fa-twitter'} />
    default:
      return <i className={'fas fa-align-left'} />
  }
}

function VisibleMessageImage({message}){
  return <img src={message.link} style={{maxWidth: '100%'}} />
}

function VisibleMessageYoutube({message}){
  const matches = message.link.match(/^.*(youtu.be\/|v\/|e\/|u\/\w+\/|embed\/|v=)([^#\&\?]*).*/)
  const videoId = matches[matches.length-1]
  return <YouTube videoId={videoId} />
}

function VisibleMessageTwitter({message}){
  const tweetId = nodeURL.parse(message.link).pathname.split('/')[3]

  return <TwitterTweetEmbed tweetId={tweetId} />
}

function VisibleMessageVideo({message}){
  let videourl = message.link.replace('.gifv', '.mp4');
  return (
    <video controls loop="true" autoplay="true" muted="true">
      <source src={videourl} />
      Your browser does not support video
    </video>
  )
}

function VisibleMessage({message}){
  let decrypted = null
  switch(message.type) {
    case 'image':
      decrypted = <VisibleMessageImage message={message} />
      break
    case 'youtube':
      decrypted = <VisibleMessageYoutube message={message} />
      break
    case 'twitter':
      decrypted = <VisibleMessageTwitter message={message} />
      break
    case 'video':
      decrypted = <VisibleMessageVideo message={message} />
      break
    case 'imgur':
      decrypted = <VisibleMessageVideo message={message} />
      break
    default:
      decrypted = <Linkify>{message.message}</Linkify>
      break
  }
  return <DecryptedMessage {...{decrypted}} />
}

function getHintLocation(message){
  switch(message.type) {
    case 'text':
      return (message.length || message.message.length) > 200 ? 'top' : 'bottom'
    default:
      return 'bottom'
  }

}

export default function MessagageBody({message, token, isSignedIn, actions}){
  const name = token.name || 'unknown'
  const hiddentext = message.hidden ? <div className='hidden-text'><InvisibleSubtext name={name} token={token} message={message} isSignedIn={isSignedIn} actions={actions} /></div> : null
  const text = message.hidden ? <HiddenMessage message={message} key={'hidden'+message.id}/> : <VisibleMessage message={message} key={'visible'+message.id}/>
  return (
    <>
      <Col md="1" className='content-type-hint'>
        <MessageIcon message={message} />
      </Col>
      <Col md="10">
        <div className='message-target'>{text}</div>
        {hiddentext}
        {message.hint && <div className='message-hint'>hint: {message.hint}</div>}
      </Col>
    </>
  )
}