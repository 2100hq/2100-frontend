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

export default function MessageCard({message, myToken, token, isSignedIn, actions, canCopyUrl=true, canLinkToProfile=true, canComment=true, showFooter=true}){
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
    <div className={`message ${destroyCountDown == null ? '' : 'message-destroy-countdown'} message-type-${message.type.replace(/:.*/,'')}`} key={message.id}>
      {destroyIcon}
      <Row className='message-header text-muted align-items-center'>
        <Col md='1'>
          <ProfileImage token={token} />
        </Col>
        <Col md='9 ml-2'>
          <span className='token-name'>
            { canLinkToProfile ? <Link to={`/$${token.name}`}>{token.name}</Link> : token.name }
            <span className='message-time text-muted'>
              { canLinkToProfile ? <Link to={messageUrl}>{ago(message.created)}</Link> : ago(message.created) }
            </span>
          </span>
        </Col>
      </Row>
      <Row className='message-body'>
        <MessageBody {...{message, myToken, token, isSignedIn, actions, canLinkToProfile}} />
      </Row>
      <Row className='message-footer small' style={{ display: showFooter ? 'auto' : 'none'}}>
        <Col md="1" />
        <Col className='mt-3 mb-3'>
          <HoldersProfiles prefix='' suffix='have seen' noholderstext="Be the first to see" holders={message.recipients || message.recipientcount} noholders/>
        {canCopyUrl && (
          <CopyToClipboard text={window.location.origin + messageUrl}
            onCopy={() => setCopied(true)}>
            <div className="small message-copy-url"><i className="fas fa-link"></i><span>{copied ? 'Copied!' : 'Copy link'}</span></div>
          </CopyToClipboard>

        )}
        {/*{!message.hidden && canComment && <div><a onClick={ ()=> actions.setShowCreate({replyid: message.id})}>Comment</a></div>}*/}
        </Col>
      </Row>
    </div>
   )
}