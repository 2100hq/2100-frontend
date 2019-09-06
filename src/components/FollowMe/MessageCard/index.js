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
import {Row, Col} from 'react-bootstrap'



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
      <Row  className='message-header text-muted'>
        <Col md='1'>
          <ProfileImage token={token} />
        </Col>
        <Col>
          <span className='token-name large'>
            <Link to={`/$${token.name}`}>{token.name}</Link>
            <span className='message-time text-muted'>
              <Link to={messageUrl}>{ago(message.created)}</Link>
            </span>
          </span>
        </Col>
      </Row>
      <Row className='message-body'>
        <MessageBody {...{message, myToken, token, isSignedIn, actions}} />
      </Row>
      <Row  className='message-footer small'>
        <Col md="1" />
        <Col>
          <hr />
          <HoldersProfiles prefix='' suffix=' can see' noholderstext="Be the first to see" holders={message.recipients || message.recipientcount} noholders/>
        <CopyToClipboard text={window.location.origin + messageUrl}
          onCopy={() => setCopied(true)}>
          <div className="small message-copy-url"><i className="fas fa-link"></i><span>{copied ? 'Copied!' : 'Copy link'}</span></div>
        </CopyToClipboard>
        </Col>
      </Row>
    </div>
   )
}