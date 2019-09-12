import React, { useState, useEffect } from 'react'
import { useStoreContext } from '../../contexts/Store'
import { Redirect } from 'react-router-dom'
import { Row, Col, Card } from 'react-bootstrap'
import { toDecimals } from '../../utils'
import { sortBy, get } from 'lodash'
import All from './All'


function Search(){
  return(
    <form className='form-inline'>
      <label className='sr-only'>Username</label>
      <div className='input-group mb-2 mr-sm-2'>
        <div className='input-group-prepend'>
          <div className='input-group-text'>$</div>
        </div>
        <input
          type='text'
          className='form-control'
          id='inlineFormInputGroupUsername2'
          placeholder='by username'
        />
      </div>
    </form>
  )
}

function Tab({currentTab, tabName, setTab, badge}){
  function handleClick(e){
    e.preventDefault()
    setTab(tabName)
  }
  const isActive = currentTab === tabName
  return(
    <li className='nav-item' key={tabName}>
      <a
        className={`nav-link ${isActive && 'active'}`}
        onClick={handleClick}
        href="#"
      >
        {tabName}
        <Badge isActive={isActive} text={badge} />
      </a>
    </li>
  )
}

function getPendingTokens(state){
  let tokens = Object.values(state.tokens || {}).filter(token => token.pending)
  tokens = sortBy(tokens, token => {
    return token.created
  })
  return tokens
}

function getActiveTokens(state){
  return Object.values(state.tokens || {}).sort( (a, b) => a.rank - b.rank )
}

function getMyStakedOrHeldTokens(state){
  return Object.values(state.tokens || {}).filter(token => {
    const hasBalance = get(token, 'balances.available', "0") !== "0"
    const isStaking = get(token, 'myStake', "0") !== "0"
    return hasBalance || isStaking
  }).sort( (a, b) => a.rank - b.rank )
}

function Badge({ text, isActive }){
  if (text == null) return null
  return (
    <span
        className={`badge badge-${isActive ? 'light' : 'info'}`}
        style={{ marginLeft: '0.25em' }}
      >
        {text}
    </span>
  )
}

export default function Discover () {
  const { state, query } = useStoreContext()
  const [currentTab, setTab] = useState('All')
  const [isEditing, setIsEditing] = useState({})

  useEffect( ()=>{
    setIsEditing({})
  },[currentTab])

  const tabMap = {
    All: () => <All tokens={getActiveTokens(state)} myToken={query.getMyToken()} isAllocating={query.getIsAllocating()} isEditing={isEditing} setIsEditing={setIsEditing}/>,
    'Holding': () => <All tokens={getMyStakedOrHeldTokens(state)} myToken={query.getMyToken()} isAllocating={query.getIsAllocating()} isEditing={isEditing} setIsEditing={setIsEditing}/>
  }
  // badge={tabName === 'My Wallet' && `${toDecimals(state.controller.balances.used)}/${toDecimals(state.controller.balances.total)}`  }
  const tabs = Object.keys(tabMap).map( tabName => <Tab currentTab={currentTab} tabName={tabName} setTab={setTab} key={tabName} /> )

  return (
    <Row>
      <Col md='12'>
            <Row className='mt-4 mb-4'>
              <Col md='4'>
                <Search />
              </Col>
              <Col md='8'>
                <ul className='nav nav-pills inline'>{tabs}</ul>
              </Col>
            </Row>
        {currentTab ? tabMap[currentTab]() : null}
      </Col>
    </Row>
  )
}