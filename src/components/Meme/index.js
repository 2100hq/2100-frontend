import React, {useState} from 'react'
import './style.scss'

export default function Meme({url,toptext,bottomtext})  {
  return(
    <div className='meme'>
      <img src={url} />
      <div className='toptext'>{toptext}</div>
      <div className='bottomtext'>{bottomtext}</div>
    </div>
  )
}