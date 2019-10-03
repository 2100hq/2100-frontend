import React, { useState, useEffect, useMemo } from 'react'
import { useStoreContext } from '../../contexts/Store'
import { toDecimals,BigNumber,convertToTwoDecimals } from '../../utils'
import { debounce } from 'lodash'
import Allocator from '../Allocator'
import ProfileImage from '../ProfileImage'
import LinkableName from '../LinkableName'

export default function AllocateMultiple(){
  const { state,query } = useStoreContext()
  let isEditing = query.getIsEditingAllocations()
  const isSignedIn = query.getIsSignedIn()
  let editingTokenId = isEditing&&isEditing.tokenid

  const [used, setUsed] = useState({})

  let total = useMemo(() => Number(toDecimals(state.controller.balances.total)), [state.controller.balances.total])

  let available = useMemo(() => {
      if (!total) return 0
      const sum = Object.values(used).reduce( (sum, amount) => sum.plus(Number(amount).toFixed(2)), BigNumber(0))
      return BigNumber(total).minus(sum).toNumber()
    }, [total, used])

  if (!total) total = 10**18
  if (!available) available = 0

  const availablePercent = (available/total)*100

  const tokens = useMemo( () => {
    if (!editingTokenId) return []
    let tokens = {...query.getMyStakedTokens()}
    if (tokens[editingTokenId]){delete tokens[editingTokenId]}
    tokens = Object.keys(tokens)
    tokens.unshift(editingTokenId)
    return tokens.map(query.getToken)
  }, [isEditing, isSignedIn])

  const tokensHash = tokens.map(t=>t.myStake).join('')

  function changeUsed(tokenid, changed){
    setUsed(prevUsed => {
      return {...prevUsed, [tokenid]: changed}
    })
  }

  useEffect(()=>{
    setUsed(
      tokens.reduce( (obj, token) => {
        obj[token.id] = Number(toDecimals(token.myStake || 0))
        return obj
      }, {})
    )
  }, [tokensHash])

  const rows = tokens.map(token => {
    return (
      <div className={"row no-gutters asset-row align-items-center"} key={token.id}>
        <div className='col-1' style={{textAlign: 'center'}}>
            <ProfileImage token={token} /><br/>
        </div>
        <div className="col-2" style={{overflow: 'hidden'}}>
          <LinkableName token={token} />
        </div>
        <div className="col-9">
          <Allocator token={token} className='allocator' onChange={changeUsed}/>
        </div>
      </div>
    )
  })

  return (
    <React.Fragment>
      <div className='progress-bar-area'>
        <div className='row align-items-center'>
        <div className='col-md-5'></div>
        <div className='col-md-4'>
              <div className="progress">
                <div className="progress-bar" role="progressbar" style={{width: String(availablePercent)+'%'}} aria-valuenow="75" aria-valuemin="0" aria-valuemax="100">
                </div>
              </div>
        </div>
        <div className='col-md-3'>
        <span>
          <img className='dai-logo' src='/img/dai.png' /> {convertToTwoDecimals(available.toString())} / {convertToTwoDecimals(total.toString())}
        </span>
        </div>
        </div>
      </div>
      <div className="asset-table">
        {rows}
      </div>
    </React.Fragment>





  )
}