import React, {useState, useRef} from 'react'
import {useStoreContext} from '../../contexts/Store'
import PublicFeed from '../FollowMe/PublicFeed'
import MyFeed from '../FollowMe/MyFeed'
import ThresholdFeed from '../FollowMe/ThresholdFeed'
import TypeFeed from '../FollowMe/TypeFeed'
import Navigation from '../Nav/Navigation'

import './style.scss'


export default function Sidebar (props) {
  const {onChangePage} = props

  const {query} = useStoreContext()

  const currentView = query.getCurrentView()

  const viewMap = {
    New: () => <PublicFeed onChangePage={onChangePage}/>,
    Following: () => <MyFeed onChangePage={onChangePage}/>,
    Cheap: () => <ThresholdFeed maxThreshold="0.00021" onChangePage={onChangePage}/>,
    Premium: () => <ThresholdFeed minThreshold="0.5" onChangePage={onChangePage}/>,
    Gifts: () =>  <TypeFeed type="gift" onChangePage={onChangePage}/>
  }

  const view = typeof viewMap[currentView] === 'function' ? viewMap[currentView]() : null

  return (
  	<div>
      <Navigation />
	  	{view}
  	</div>
    )
}