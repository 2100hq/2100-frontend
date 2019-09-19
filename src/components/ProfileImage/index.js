import React from 'react'
import './style.scss'

const url = name => `https://res.cloudinary.com/dhvvhdndp/image/twitter_name/${name}.png`
const onError = e => e.target.src=url('0x00000')

export default function ProfileImage({token, className='', style={} }){
  const name = typeof token === 'string' ? token : token.name
  return <img className={'profile-image '+className} alt={`$${name}`} title={`$${name}`} style={style} src={url(name)} onError={onError} />
}