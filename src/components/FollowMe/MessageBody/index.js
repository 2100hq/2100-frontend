import React, {useState, useEffect } from 'react'
import * as linkify from 'linkifyjs';
import Linkify from 'linkifyjs/react';
import YouTube from 'react-youtube';
import { TwitterTweetEmbed } from 'react-twitter-embed';
import './style.scss'
const nodeURL = require('url');

function HiddenMessageBlock({faicon}){
  return(
    <div className='hidden-message-block'>
      <div className='row'>
        <div className='col-md-2 content-type-hint'><i class={faicon}></i></div>
        <div className='col pretend-encryption'>
          3 3 8 0 3 E 9 1 6 9 F B 4 E B 5 
          7 E E E E 5 B B 8 9 9 8 7 A 3 C 
          2 1 A 0 F 7 3 D 9 2 2 0 9 3 4 F
        </div>
      </div>

    </div>
  )
}

function HiddenMessageInline({message, limit = 1}){
  let chars = []

  for (var index = 0; index < message.length; index++){
    chars.push('x ')
  }

  return <span className='hidden-message-inline'>{chars.join('')}</span>
}

function HiddenMessage({message}){
  switch(message.type) {
    case 'image':
      return <HiddenMessageBlock faicon={'fas fa-image'} />
    case 'imgur':
      return <HiddenMessageBlock faicon={'fas fa-image'} />
    case 'video':
      return <HiddenMessageBlock faicon={'fas fa-video'} />
    case 'youtube':
      return <HiddenMessageBlock faicon={'fab fa-youtube'} />
    case 'twitter':
      return <HiddenMessageBlock faicon={'fas fa-twitter'} />
    default:
      return <HiddenMessageBlock faicon={'fas fa-align-left'} />
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
  return (
    <div className='message-body'>
      <div className='message-target'>{text}</div>
      {message.hint && <div className='message-hint'>hint: {message.hint}</div>}

    </div>
  )
}