import React, { useMemo } from 'react'
import { compact } from 'lodash'
import { useStoreContext } from '../../contexts/Store'
import { Nav } from 'react-bootstrap'
import history from '../../utils/history'

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
      return <span><i class="fas fa-shopping-cart"></i> Low-Cost</span>
    case 'Premium':
      return <span><i class="fas fa-money-bill-alt"></i> Premium</span>
    case 'New':
      return <span><i class="fas fa-bell"></i> New</span>
    case 'Following':
      return <span><i class="fas fa-user"></i> Following</span>
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
      if (view === 'Following') return false // if not signed in, cant see "Holding"
      return true
    })
  }, [isSignedIn])

  if (allowedViews.length < 2) return null // don't need to show tabs if there's only one possible view

  const tabs = allowedViews.map( viewType => <Nav.Link eventKey={viewType}>{getViewName(viewType)}</Nav.Link> )

  return (
    <div  style={{marginBottom: '2rem'}}>
      <Nav activeKey={currentView} defaultActiveKey={currentView} variant="pills" onSelect={setView}>
        {tabs}
      </Nav>
    </div>
  )
}