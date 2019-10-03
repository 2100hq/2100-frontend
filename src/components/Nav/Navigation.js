import React, { useMemo } from 'react'
import { compact } from 'lodash'
import { useStoreContext } from '../../contexts/Store'
import { useFollowMeContext } from '../../contexts/FollowMe'
import { Nav } from 'react-bootstrap'
import history from '../../utils/history'
import {Badge} from 'react-bootstrap'
import CreateMessageButton from '../FollowMe/CreateMessageButton'
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

export default function Navigation(){
  const {state, query, dispatch, actions} = useStoreContext()
  const { messages, isSignedIn } = useFollowMeContext()
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


  function getViewName(viewType){
    switch(viewType){
      case 'Decodable':
        const number = Object.values(messages||{}).filter(m=>m.decodable).length
        const badge = number > 0 ? <span className="decodable-posts">{number}</span> : null
        return <span>Decodable {badge}</span>
      case 'Decoding':
        return <span>Staking</span>
      case 'Decoded':
        return <span>Seen</span>
      default:
        return viewType
    }
  }

  return (
    <Nav className='fm-nav sticky-top' activeKey={currentView} defaultActiveKey={currentView} onSelect={setView}>
      {tabs}
      <CreateMessageButton />
    </Nav>
  )
}