import React from 'react'
import {useFollowMeContext} from '../../contexts/FollowMe'
import {useStoreContext} from '../../contexts/Store'
import {sortBy} from 'lodash'
import MessageForm from './MessageForm'
import MessageCard from './MessageCard'
import './style.scss'

export default function FollowMeFeed({messages={}, showForm, className, styles}){
  const {query} = useStoreContext()
  let { isSignedIn, myToken, actions } = useFollowMeContext()

  const cards = Object.values(sortBy(messages, msg => msg.created * -1)).map( message => <MessageCard message={message} myToken={myToken} token={query.getToken(message.tokenid)} isSignedIn={isSignedIn} actions={actions} key={message.id+(message.hidden||'visible')} canComment={false}/>)

  return (
    <div className={className} styles={styles}>
        { showForm && <MessageForm /> }
        {cards}
    </div>
  )
}