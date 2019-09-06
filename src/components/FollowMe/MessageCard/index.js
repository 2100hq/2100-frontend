import React, {useState, useEffect } from 'react'
import {useStoreContext} from '../../../contexts/Store'
import {get, shuffle} from 'lodash'
import { BigNumber, toDecimals, weiDecimals } from '../../../utils'
import { Link } from 'react-router-dom'
import ms from 'ms'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import ProfileImage from '../../ProfileImage'
import MessageBody from '../MessageBody'
import HoldersProfiles from '../HoldersProfiles'

function InvisibleSubtext({name, token, message, isSignedIn, state, actions}){
  /* 4 states
   - Not signed in
   - Signed in, not staking
   - Signed in, staking (not able to decode)
   - Signed in, able to decode
  */
  const [decoding, setDecoding] = useState(false)

  if (!isSignedIn) return <span>hold {toDecimals(message.threshold,3,0)} <span className='token-name'>{name} to see</span></span>

  const available = get(token, 'balances.available', "0")
  const diff = BigNumber(message.threshold).minus(available)
  const isStaking = BigNumber(token.myStake).gt(0)
  let timeToDecode = null

  if (!isStaking) return <span>hold {toDecimals(message.threshold,3,0)} <span className='token-name'>{name} to see</span></span>

  async function decodeMessage(id){
    setDecoding(true)
    const resp = await actions.decodeMessage(id)
    setDecoding(false)
  }

  function handleClick(e){
    e.preventDefault()
    decodeMessage(message.id)
  }

  if (isStaking && diff.gt(0)){
    const divisor = BigNumber(token.myStake).div(token.totalStakes).times(0.9).times(0.00021).times(weiDecimals)
    const blocks = diff.div(divisor).dp(0,0).toNumber()
    timeToDecode = (<span>({ms(blocks*15000)} to go)</span>)
  }



  if (diff.gt(0)) return <span>getting {toDecimals(diff, 3, 0)} <span className='token-name'>{name}</span> {timeToDecode}</span>

  if (decoding) return <span>decoding...</span>

  return <span>you have enough <span className='token-name'>{name}</span> to <a href="#" onClick={handleClick}>decode</a></span>
}

// function VisibleSubtext({name, message, myToken}){
//   let count = message.recipientcount
//   const isOwner = myToken && myToken.id === message.tokenid
//   const displayName = isOwner ? 'your token' : <span className='token-name'>{name}</span>

//   // didnt store recipient count
//   if (count == null) return <span>some holders of <span className='token-name'>{name}</span></span>

//   count = isOwner ? count : `${count === 0 ? 'no' : count-1} other`

//   return <span>{count} holders of {displayName}</span>
// }


function ago(past){
  let elapsed = Date.now()-past
  elapsed = Math.floor(elapsed/1000)*1000
  if (elapsed === 0) return 'now'
  return ms(elapsed)
}

export default function MessageCard({message, myToken, token, isSignedIn, actions}){
  const [destroyCountDown, setDestroyCountDown] = useState(null)
  const [copied, setCopied] = useState(null)
  const name = token.name || 'unknown'
  const hiddentext = message.hidden ? <div><i className='fas fa-eye' /> <InvisibleSubtext name={name} token={token} message={message} isSignedIn={isSignedIn} actions={actions} /></div> : null //<VisibleSubtext name={name} message={message} myToken={myToken} />

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
        { destroyCountDown == null ? <i className="fas fa-times"></i> : destroyCountDown <= 0 ? <i className="fas fa-circle destroying"></i> : <span>{destroyCountDown} <span className='small text-muted'>(cancel)</span></span> }
      </a>
    )
  }

  useEffect(() => {
    const id = setTimeout(setCopied, 1500, null)
    return () => clearTimeout(id)
  }, [copied])

  const messageUrl = `/$${token.name}/${message.shortid || message.id}`

  return (
    <div className={`message ${destroyCountDown != null && 'message-destroy-countdown'} message-type-${message.type}`} key={message.id}>
        {destroyIcon}
        <div className='message-header text-muted'>
          <ProfileImage token={token} />
          <span className='token-name large'>
            <Link to={`/$${token.name}`}>{token.name}</Link>
            <span className='message-time text-muted'>
              <Link to={messageUrl}>{ago(message.created)}</Link>
            </span>
          </span>
        </div>
        <MessageBody message={message} />
        <div className='message-footer small'>
          <hr />
            {hiddentext}
            <HoldersProfiles prefix='Visible to ' holders={message.recipients || message.recipientcount}/>
          <CopyToClipboard text={window.location.origin + messageUrl}
            onCopy={() => setCopied(true)}>
            <div className="small message-copy-url"><i className="fas fa-link"></i><span>{copied ? 'Copied!' : 'Copy link'}</span></div>
          </CopyToClipboard>
        </div>
    </div>
   )
}