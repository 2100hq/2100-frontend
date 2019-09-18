import React, {useState} from 'react'
import {useStoreContext} from '../../contexts/Store'
import PublicFeed from '../FollowMe/PublicFeed'
import MyFeed from '../FollowMe/MyFeed'
import CheapFeed from '../FollowMe/CheapFeed'
import './style.scss'


export default function Sidebar (props) {
  const {query} = useStoreContext()
  const currentView = query.getCurrentView()
  const viewMap = {
    New: () => <PublicFeed />,
    Following: () => <MyFeed />,
    Cheap: () => <CheapFeed />
  }

  const view = typeof viewMap[currentView] === 'function' ? viewMap[currentView]() : null
  return (
  	<div>
	  	{view}
  	</div>
    )
}