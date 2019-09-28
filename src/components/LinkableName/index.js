import React from 'react'
import history from '../../utils/history'
import clickHanlder from '../../utils/clickHandler'

export default function LinkableName({name, token, style={}, className=''}){
  if (token) {
    if (token.name) {
      name = token.name
    } else {
      name = token
    }
  }
  return (
    <a href="#" onClick={clickHanlder(history.push,[`/$${name}`])} style={style} className={className}>
      ${name}
    </a>
  )
}