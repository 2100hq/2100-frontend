import React from 'react'
import history from '../../utils/history'
import clickHandler from '../../utils/clickHandler'
import { isEmpty } from 'lodash'
import './style.scss'

const url = name => {
  return `https://res.cloudinary.com/fva9mqeez2demylv/image/twitter_name/${name}.png`}
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
  if (isEmpty(name)) name = '0x00000'
  return (
    <a href={linkable ? '#' : null} onClick={clickHandler(onClick)}>
      <img className={'img-fluid profile-image '+className} alt={`$${name}`} title={`$${name}`} style={style} src={url(name)} onError={onError} />
    </a>
  )
}