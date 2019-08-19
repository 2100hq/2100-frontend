import React from 'react'
import './style.scss'

export default function Dots(props){
  const dots = Array.from(Array(props.total)).map( (_,level) => <Dot level={level} {...props} key={level}/> )

  return (
    <div className='dots'>
      {dots}
    </div>
  )
}

function Dot({ level, current = 0, isDisabled = false, onClick = () => {}}){
  const classNames = [`dot${level}`]
  if (level == 0 && current > 0) classNames.push('active')
  if (level > 0 && current >= level) classNames.push('active')
  if (isDisabled) classNames.push('disabled')
  const className = classNames.join(' ')
  return (
    <span key={level} className={className} onClick={() => onClick(level)} />
  )
}