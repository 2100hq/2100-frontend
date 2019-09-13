import React, {useState} from 'react'
import {useStoreContext} from '../../contexts/Store'
import PublicFeed from '../FollowMe/PublicFeed'
import MyFeed from '../FollowMe/MyFeed'
import TopTenFeed from '../FollowMe/TopTenFeed'
import './style.scss'


export default function Sidebar (props) {
  const {query} = useStoreContext()
  const currentView = query.getCurrentView()
  const viewMap = {
    All: () => <PublicFeed />,
    Holding: () => <MyFeed />,
    'Top Ten': () => <TopTenFeed />
  }

function Meme({url,toptext,bottomtext})  {
  return(
    <div className='meme'>
      <img src={url} />
      <div className='toptext'>{toptext}</div>
      <div className='bottomtext'>{bottomtext}</div>
    </div>
  )
}

  const view = typeof viewMap[currentView] === 'function' ? viewMap[currentView]() : null
  return (
  	<div>
      <Meme 
        url='https://img.cinemablend.com/quill/c/6/1/8/7/5/c61875be1d9d82464e3c29f33ba90b68c54d4775.jpg' 
        toptext='When my friends see me dancing' 
        bottomtext='I slide into the bushes'
      />
	  	{view}
  	</div>
    )
}