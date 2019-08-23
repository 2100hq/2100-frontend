import React, {useState } from 'react'
import {useStoreContext} from '../../contexts/Store'
import {get} from 'lodash'
import { BigNumber, toDecimals, weiDecimals } from '../../utils'
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

  return <span>you have enough {name} to <a href="#" onClick={handleClick}>decode</a></span>
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


function HiddenMessage({message}){
  let chars = []
  let alphabet = "😂😎💩🦊🐔🍕🍤🍎📱⌚️🇰🇵🇯🇵🇨🇦🦷"
  for (var index = 0; index < message.length; index++){

    switch(index % 5) {
      case 0:
        chars.push(<span className={'hidden-char '+ 'c' + index % 5 } key={index}>💩</span>)
        break;
      case 1:
        chars.push(<span className={'hidden-char '+ 'c' + index % 5 } key={index}>🦊</span>)
        break;
      case 2:
        chars.push(<span className={'hidden-char '+ 'c' + index % 5 } key={index}>🍕</span>)
        break;
      case 3:
        chars.push(<span className={'hidden-char '+ 'c' + index % 5 } key={index}>🐔</span>)
        break;
      case 4:
        chars.push(<span className={'hidden-char '+ 'c' + index % 5 } key={index}>😎</span>)
        break;
    }
  }

  return(
    <span>
      {chars}
    </span>
  )
}

export default function MessageCard({message, myToken, token, isSignedIn, actions}){
  const name = token.name || 'unknown'
  const text = message.hidden ? <HiddenMessage message={message}/> : message.message
  const subtext = message.hidden ? <InvisibleSubtext name={name} token={token} message={message} isSignedIn={isSignedIn} actions={actions} /> : <VisibleSubtext name={name} message={message} myToken={myToken} />
  return (
    <div className='message card' key={message.id}>
      <div className={`card-body ${message.hidden ? 'text-muted more-text-muted' : ''}`}>
        <div className='message-header text-muted'>
          <span className='token-name'>{name}</span>
          <span className='message-divider'> · </span>
          <span className='message-time text-muted'>{ms(Date.now()-message.created)}</span>
        </div>
        <div className='message-body'>
          <p>{text}</p>
        </div>
        <div className='message-footer small text-muted'>
            <i className='fas fa-eye' />  {subtext}
        </div>
      </div>
    </div>
   )
}