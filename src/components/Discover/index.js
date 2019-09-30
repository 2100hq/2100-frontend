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

function Tab({currentView, tabName, setTab, badge}){
  function handleClick(e){
    e.preventDefault()
    setTab(tabName)
  }
  const isActive = currentView === tabName
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
  const { state, query, dispatch, actions } = useStoreContext()
  const currentView = query.getCurrentView()

  const {setIsEditing} = query
  const isEditing = query.getIsEditingAllocations()

  useEffect(()=>{
    setIsEditing({})
  },[currentView])

  const viewMap = {
    New: () => <All key='New' tokens={query.getActiveTokensArray()} myToken={query.getMyToken()} isAllocating={query.getIsAllocating()} isEditing={isEditing} setIsEditing={setIsEditing}/>,
    'Following': () => <All key='Following' tokens={query.getMyStakedOrHeldTokensArray()} myToken={query.getMyToken()} isAllocating={query.getIsAllocating()} isEditing={isEditing} setIsEditing={setIsEditing}/>
  }

  const view = typeof viewMap[currentView] === 'function' ? viewMap[currentView]() : viewMap.New()

  return (
    <>
        {view}
    </>
  )
}