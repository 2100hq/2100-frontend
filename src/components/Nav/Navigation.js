import React, { useMemo } from 'react'
import { compact } from 'lodash'
import { useStoreContext } from '../../contexts/Store'
import { Nav } from 'react-bootstrap'
import history from '../../utils/history'
import './style.scss'
function Tab({current, name, set}){
  function handleClick(e){
    e.preventDefault()
    set(name)
  }
  const isActive = current === name
  return(
    <li active={isActive} onClick={handleClick} >
      {name}
    </li>
  )
}

function getViewName(viewType){
  switch(viewType){
    case 'Cheap':
      return <span>Low Cost</span>
    case 'Premium':
      return <span>Premium</span>
    case 'New':
      return <span>New</span>
    case 'Following':
      return <span>Following</span>
    case 'Gifts':
      return <span>Gifts</span>
    default:
      return viewType
  }
}

export default function Navigation(){
  const {state, query, dispatch, actions} = useStoreContext()
  const isSignedIn = query.getIsSignedIn()
  const currentView = query.getCurrentView()

  const setView = view => {
    dispatch(actions.update('view', view))
    history.push('/')
  }

  // Some views are only for signed in users
  const allowedViews = useMemo(()=>{
    if (isSignedIn) return state.config.views // if signed in, see everything
    return state.config.views.filter( view => {
      if (/dec/i.test(view)) return false // if not signed in, cant see "decoded/decoding"
      return true
    })
  }, [isSignedIn])

  if (allowedViews.length < 2) return null // don't need to show tabs if there's only one possible view

  const tabs = allowedViews.map( viewType => <Nav.Link eventKey={viewType} key={viewType}>{getViewName(viewType)}</Nav.Link> )

  return (
    <Nav className='fm-nav small' activeKey={currentView} defaultActiveKey={currentView} onSelect={setView}>
      {tabs}
    </Nav>
  )
}