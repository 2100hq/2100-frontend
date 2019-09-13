import React, {useState} from 'react'
import {useStoreContext} from '../../contexts/Store'
import PublicFeed from '../FollowMe/PublicFeed'
import MyFeed from '../FollowMe/MyFeed'
import './style.scss'


export default function Sidebar (props) {
  const {query} = useStoreContext()
  const currentView = query.getCurrentView()
  const viewMap = {
    All: () => <PublicFeed />,
    Holding: () => <MyFeed />,
  }

  const view = typeof viewMap[currentView] === 'function' ? viewMap[currentView]() : null
  return (
  	<div>
	  	{view}
  	</div>
    )
}