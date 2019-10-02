import React, {useState, useRef} from 'react'
import {useStoreContext} from '../../contexts/Store'
import PublicFeed from '../FollowMe/PublicFeed'
import MyFeed from '../FollowMe/MyFeed'
import ThresholdFeed from '../FollowMe/ThresholdFeed'
import DecodedFeed from '../FollowMe/DecodedFeed'
import DecodingFeed from '../FollowMe/DecodingFeed'
import DecodableFeed from '../FollowMe/DecodableFeed'
import Navigation from '../Nav/Navigation'

import './style.scss'


export default function Sidebar (props) {
  const {onChangePage} = props

  const {query} = useStoreContext()

  const currentView = query.getCurrentView()

  const viewMap = {
    New: () => <PublicFeed onChangePage={onChangePage}/>,
    Premium: () => <ThresholdFeed minThreshold="0.5" onChangePage={onChangePage}/>,
    Decoding: () => <DecodingFeed minThreshold="0.5" onChangePage={onChangePage}/>,
    Decodable: () => <DecodableFeed minThreshold="0.5" onChangePage={onChangePage}/>,
    Decoded: () => <DecodedFeed minThreshold="0.5" onChangePage={onChangePage}/>,
  }

  const view = typeof viewMap[currentView] === 'function' ? viewMap[currentView]() : null

  return (
  	<div>
      <Navigation />
	  	{view}
  	</div>
    )
}