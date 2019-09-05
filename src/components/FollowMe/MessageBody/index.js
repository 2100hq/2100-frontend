import React, {useState, useEffect } from 'react'
import * as linkify from 'linkifyjs';
import Linkify from 'linkifyjs/react';
import YouTube from 'react-youtube';
import { TwitterTweetEmbed } from 'react-twitter-embed';
import './style.scss'
const nodeURL = require('url');

function HiddenMessageImage(){
  return(
    <div className='hidden-message-block hidden-message-image'>
      <i class="far fa-image"></i>
    </div>
  )
}
function HiddenMessageYoutube(){
  return(
    <div className='hidden-message-block hidden-message-youtube'>
      <i class="fab fa-youtube"></i>
    </div>
  )
}
function HiddenMessageTwitter(){
  return(
    <div className='hidden-message-block hidden-message-twitter'>
      <i class="fab fa-twitter-square"></i>
    </div>
  )
}

function HiddenMessageDefault({message, limit = 1}){
  let chars = []

  for (var index = 0; index < message.length; index++){
    const i = index % limit
    chars.push(<span className={'hidden-char '+ 'c' + i} key={index}>x</span>)
  }

  return chars
}

function HiddenMessage({message}){
  switch(message.type) {
    case 'image':
      return <HiddenMessageImage />
    case 'imgur':
      return <HiddenMessageImage />
    case 'video':
      return <HiddenMessageYoutube />
    case 'youtube':
      return <HiddenMessageYoutube />
    case 'twitter':
      return <HiddenMessageTwitter />
    default:
      return <HiddenMessageDefault message={message} />
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

export default function MessagageBody({message}){
  const text = message.hidden ? <HiddenMessage message={message}/> : <VisibleMessage message={message} />
  const hintLocation = getHintLocation(message)
  return (
    <div className='message-body'>
      {message.hint && hintLocation === 'top' && <h5>{message.hint}</h5>}
      <div className='message-target'>{text}</div>
      {message.hint && hintLocation === 'bottom' && <div className='hint small'>hint: {message.hint}</div>}
    </div>
  )
}