import React, { useState, useEffect, useMemo } from 'react'
import { useStoreContext } from '../../contexts/Store'
import Allocator from '../Allocator'
import ProfileImage from '../ProfileImage'
import LinkableName from '../LinkableName'

function Row({token}){
  return (
    <div className={"row no-gutters asset-row align-items-center"}>
      <div className='col-1' style={{textAlign: 'center'}}>
          <ProfileImage token={token} /><br/>
      </div>
      <div className="col-2" style={{overflow: 'hidden'}}>
        <LinkableName token={token} />
      </div>
      <div className="col-9">
        <Allocator token={token} className='allocator' />
      </div>
    </div>
  )
}

export default function AllocateMultiple(){
  const { query } = useStoreContext()
  let isEditing = query.getIsEditingAllocations()
  const isSignedIn = query.getIsSignedIn()
  let editingTokenId = isEditing&&isEditing.tokenid

  const tokens = useMemo( () => {
    if (!editingTokenId) return []
    let tokens = {...query.getMyStakedTokens()}
    if (tokens[editingTokenId]){delete tokens[editingTokenId]}
    tokens = Object.keys(tokens)
    tokens.unshift(editingTokenId)
    return tokens.map(query.getToken)
  }, [isEditing, isSignedIn])

  const rows = tokens.map(token => <Row token={token} />)

  return (
    <div className="asset-table">
      {rows}
    </div>
  )
}