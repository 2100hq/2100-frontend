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

function InvisibleSubtext({name, token, message, isSignedIn, actions}){
  /* 4 states
   - Not signed in
   - Signed in, not staking
   - Signed in, staking (not able to decode)
   - Signed in, able to decode
  */
  const [decoding, setDecoding] = useState(false)

  if (!isSignedIn) return <span>hold {toDecimals(message.threshold,3,0)} <span className='token-name'>{name} to see</span></span>

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



  if (diff.gt(0) && isStaking) return <span>getting {toDecimals(diff, 3, 0)} <span className='token-name'>{name}</span> {timeToDecode}</span>

  if (decoding) return <span>decoding...</span>

  if (diff.lte(0)) return <span>you have enough <span className='token-name'>{name}</span> to <a href="#" onClick={handleClick}>decode</a></span>

  if (!isStaking) return <span>hold {toDecimals(message.threshold,3,0)} <span className='token-name'>{name} to see</span></span>
}

function HiddenMessage({message}){

  const id = message.id.replace(/-/g,'').toUpperCase().split('').map( c => <span className={`char-${c}`}>{c} </span>)

  return(
    <div className='hidden-message-block'>
        <div className='pretend-encryption'>
        {id} {id}
      </div>

    </div>
  )
}

function MessageIcon({message}){
  if (!message.hidden) return null
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
      return <i className={'fas fa-twitter'} />
    default:
      return <i className={'fas fa-align-left'} />
  }
}

function VisibleMessageImage({message}){
  return <img src={message.link} style={{maxWidth: '500px', maxHeight: '400px'}} />
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
  switch(message.type) {
    case 'image':
      return <VisibleMessageImage message={message} />
    case 'youtube':
      return <VisibleMessageYoutube message={message} />
    case 'twitter':
      return <VisibleMessageTwitter message={message} />
    case 'video':
      return <VisibleMessageVideo message={message} />
    case 'imgur':
      return <VisibleMessageVideo message={message} />
    default:
      return <Linkify>{message.message}</Linkify>
  }
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
  const hiddentext = message.hidden ? <div><i className='fas fa-key' /> <InvisibleSubtext name={name} token={token} message={message} isSignedIn={isSignedIn} actions={actions} /></div> : null
  const text = message.hidden ? <HiddenMessage message={message}/> : <VisibleMessage message={message} />
  return (
    <>
      <Col md="1">
        <MessageIcon message={message} />
      </Col>
      <Col>
        <div className='message-target'>{text}</div>
        {hiddentext}
        {message.hint && <div className='message-hint'>hint: {message.hint}</div>}
      </Col>
    </>
  )
}