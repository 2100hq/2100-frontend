import React from 'react'
import history from '../../utils/history'
import clickHandler from '../../utils/clickHandler'
import './style.scss'


const url = name => `https://res.cloudinary.com/dhvvhdndp/image/twitter_name/${name}.png`
const onError = e => e.target.src=url('0x00000')

export default function ProfileImage({token, name, className='', style={}, linkable=true }){

  function onClick(){
    if (!linkable) return
    history.push(`/$${name}`)
  }

  if (token) {
    if (token.name) {
      name = token.name
    } else {
      name = token
    }
  }

  return (
    <a href={linkable ? '#' : null} onClick={clickHandler(onClick)}>
      <img className={'img-fluid profile-image '+className} alt={`$${name}`} title={`$${name}`} style={style} src={url(name)} onError={onError} />
    </a>
  )
}