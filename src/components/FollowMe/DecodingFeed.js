import React, {useState, useEffect, useMemo} from 'react'
import {useFollowMeContext} from '../../contexts/FollowMe'
import {useStoreContext} from '../../contexts/Store'
import { groupBy } from 'lodash'
import {BigNumber} from '../../utils'
import FollowMe from './'

export default function DecodingFeed({onChangePage}){
  const {query} = useStoreContext()
  let {messages, isSignedIn} = useFollowMeContext()

  const tokens = query.getMyStakedOrHeldTokensArray()
  const tokensHash = tokens.map(t => t.id+t.hasBalance+t.isStaking).join('')

  const groupedTokens = useMemo( ()=> groupBy(tokens, token => token.isStaking ? 'isStaking' : 'hasBalance'), [tokensHash])

  const messagesList = useMemo(()=>Object.values(messages), [messages,isSignedIn,tokensHash])
  const messagesHash = useMemo(()=>messagesList.map(m => m.id+m.hidden).join(''),[messagesList])
  const shownMessages = useMemo(()=>messagesList.filter(m => {
    if (!m.hidden && !m.decoded) return false // shown post hasn't recently been decoded
    if ((groupedTokens.isStaking||[]).map(t=>t.id).includes(m.tokenid)) return true // if staking, you are decoding

    const wallet = (groupedTokens.hasBalance||[]).find(t=>t.id===m.tokenid)

    if (!wallet) return false // dont have any balance for this token

    return BigNumber(wallet.balances.available).gte(m.threshold) // balance vs threshold to see the messasge. If you're not staking, only show messages where you're above the balance to see

  }),[messagesHash, tokensHash])

  return <FollowMe messages={shownMessages} className='decoding-feed' onChangePage={onChangePage}/>
}