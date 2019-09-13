import React, { useMemo } from 'react'
import { compact } from 'lodash'
import { useStoreContext } from '../../contexts/Store'
import { Nav } from 'react-bootstrap'

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

export default function Navigation(){
  const {state, query, dispatch, actions} = useStoreContext()
  const isSignedIn = query.getIsSignedIn()
  const currentView = query.getCurrentView()

  const setView = view => dispatch(actions.update('view', view))

  // Some views are only for signed in users
  const allowedViews = useMemo(()=>{
    if (isSignedIn) return state.config.views // if signed in, see everything
    return state.config.views.filter( view => {
      if (view === 'Holding') return false // if not signed in, cant see "Holding"
      return true
    })
  }, [isSignedIn])

  if (allowedViews.length < 2) return null // don't need to show tabs if there's only one possible view

  const tabs = allowedViews.map( viewName => <Nav.Link eventKey={viewName}>{viewName === 'Top Ten' ? 'Top 10' : viewName}</Nav.Link> )

  return (
    <Nav activeKey={currentView} defaultActiveKey={currentView} className="flex-column" onSelect={setView}>
      {tabs}
    </Nav>
  )
}