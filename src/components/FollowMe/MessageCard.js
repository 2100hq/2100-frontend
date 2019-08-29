import React, {useState, useEffect } from 'react'
import {useStoreContext} from '../../contexts/Store'
import {get, shuffle} from 'lodash'
import { BigNumber, toDecimals, weiDecimals } from '../../utils'
import { Link } from 'react-router-dom'
import ms from 'ms'

function InvisibleSubtext({name, token, message, isSignedIn, state, actions}){
  const [decoding, setDecoding] = useState(false)

  if (!isSignedIn) return <span>holders of {toDecimals(message.threshold,3,0)} <span className='token-name'>{name}</span></span>

  const available = get(token, 'balances.available', "0")
  const diff = BigNumber(message.threshold).minus(available)
  let timeToDecode = null

  async function decodeMessage(id){
    setDecoding(true)
    const resp = await actions.getMessage(id)
    setDecoding(false)
  }

  function handleClick(e){
    e.preventDefault()
    decodeMessage(message.id)
  }

  if (BigNumber(token.myStake).gt(0) && diff.gt(0)){
    const divisor = BigNumber(token.myStake).div(token.totalStakes).times(0.9).times(0.00021).times(weiDecimals)
    const blocks = diff.div(divisor).dp(0,0).toNumber()
    timeToDecode = (<span>({ms(blocks*15000)} to go)</span>)
  }

  if (diff.gt(0)) return <span>need {toDecimals(diff, 3, 0)} <span className='token-name'>{name}</span> {timeToDecode}</span>

  if (decoding) return <span>decoding...</span>

  return <span>you have enough <span className='token-name'>{name}</span> to <a href="#" onClick={handleClick}>decode</a></span>
}

function VisibleSubtext({name, message, myToken}){
  let count = message.recipientcount
  const isOwner = myToken && myToken.id === message.tokenid
  const displayName = isOwner ? 'your token' : <span className='token-name'>{name}</span>

  // didnt store recipient count
  if (count == null) return <span>some holders of <span className='token-name'>{name}</span></span>

  count = isOwner ? count : `${count === 0 ? 'no' : count-1} other`

  return <span>{count} holders of {displayName}</span>
}


function ago(past){
  let elapsed = Date.now()-past
  elapsed = Math.floor(elapsed/1000)*1000
  if (elapsed === 0) return 'now'
  return ms(elapsed)
}

function HiddenMessage({message, emojis = [], limit = emojis.length}){
  let chars = []

  for (var index = 0; index < message.length; index++){
    const i = index % limit
    chars.push(<span className={'hidden-char '+ 'c' + i} key={index}>x</span>)
  }

  return chars
}

export default function MessageCard({message, myToken, token, isSignedIn, actions}){
  const [destroyCountDown, setDestroyCountDown] = useState(null)
  let lively = "😂,😎,💩,🦊,🐔,🍕,🍤,🍎,📱,⌚️,🇰🇵,🇯🇵,🇨🇦".split(',')
  let monochrome = "◼️,🎩,🎓,🌑,🌚,🎱,🎬,🖤,⚫️,🏴".split(',')
  const [emojis] = useState(monochrome)

  const name = token.name || 'unknown'
  const text = message.hidden ? <HiddenMessage message={message} emojis={emojis} limit={1}/> : message.message
  const subtext = message.hidden ? <InvisibleSubtext name={name} token={token} message={message} isSignedIn={isSignedIn} actions={actions} /> : <VisibleSubtext name={name} message={message} myToken={myToken} />

  function destroyMessage(e){
    e.preventDefault()
    if (destroyCountDown == null) return setDestroyCountDown(3)
    setDestroyCountDown(null)
  }

  useEffect( ()=>{
    if (destroyCountDown == null) return
    const id = destroyCountDown > 0 ? setTimeout(setDestroyCountDown, 1000, destroyCountDown-1) : setTimeout(actions.destroy, 1000, message)
    return () => clearTimeout(id)
  }, [destroyCountDown])

  let destroyIcon = null
  if (myToken && message.tokenid === myToken.id){
    destroyIcon = (
      <a href="#" onClick={destroyMessage} className='message-delete'>
        { destroyCountDown == null ? <i className="fas fa-times"></i> : destroyCountDown <= 0 ? <i className="fas fa-circle destroying"></i> : destroyCountDown }
      </a>
    )
  }

  return (
    <div className={`message card ${destroyCountDown != null && 'message-destroy-countdown'}`} key={message.id}>
     <div className="card-body">
        {destroyIcon}
        <div className='message-header text-muted'>
        <div className='token-name large'><Link to={`$${token.name}`}>{token.name}</Link><span className='message-time text-muted'>{ago(message.created)}</span></div>        </div>
        <div className='message-body'>
          <p>{text}</p>
        </div>
         {message.hint && <p className='small'>hint: {message.hint}</p>}
        <div className='message-footer small'>
            <i className='fas fa-eye' />  {subtext}
        </div>
      </div>
    </div>
   )
}