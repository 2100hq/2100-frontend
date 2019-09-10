import React, {useState} from 'react'
import {useStoreContext} from '../../contexts/Store'
import PublicFeed from '../FollowMe/PublicFeed'
import MyFeed from '../FollowMe/MyFeed'
import './style.scss'


export default function Sidebar (props) {
  const {query} = useStoreContext()
  const [feed, setFeed] = useState('All')
  const feeds = {
    All: () => <PublicFeed />,
    Holding: () => <MyFeed />
  }

  let nav = null

  if (query.getIsSignedIn()){
    nav = Object.entries(feeds).map( ([name, fn]) => {
      const handleClick = (e)=>{
        e.preventDefault()
        setFeed(name)
      }
      return (
        <li className="nav-item" key={name}>
          <a className={`nav-link ${feed === name && 'active'}`} href="#" onClick={handleClick}>{name}</a>
        </li>
      )
    })
  }

  return (
  	<div>
  		<div className='public-header'>

  		</div>
	  	<div className='public-sub-header row'>
			<ul className="nav nav-pills">
			  {nav}
			</ul>
	  	</div>
	  	{feeds[feed]()}
  	</div>
    )
}