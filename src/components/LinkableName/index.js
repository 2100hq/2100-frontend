import React from 'react'
import history from '../../utils/history'
import clickHandler from '../../utils/clickHandler'

export default function LinkableName({name, token, style={}, className=''}){

  function onClick(){
    if (isAddress) return
    history.push(`/${name}`)
  }

  if (token) {
    if (token.name) {
      name = token.name
    } else {
      name = token
    }
  }

  if (name == null) return null

  // ethereum address
  const isAddress = name.indexOf('0x') === 0

  if (isAddress){
    name = name.slice(0,9)
  } else {
    name = `$${name}`
  }

  return (
    <a href={isAddress ? null : '#'} onClick={clickHandler(onClick)} style={style} className={className}>
      {name}
    </a>
  )
}