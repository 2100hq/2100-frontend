import React from 'react'
import PublicFeed from '../FollowMe/PublicFeed'
import './style.scss'


export default function Sidebar (props) {
  return (
  	<div>
  		<div className='public-header'>

  		</div>
	  	<div className='public-sub-header row'>
			<ul className="nav nav-pills">
			  <li className="nav-item">
			    <a className="nav-link active" href="#">All</a>
			  </li>
			  <li className="nav-item">
			    <a className="nav-link" href="#">Staking</a>
			  </li>
			</ul>
	  	</div>
	  	<PublicFeed />
  	</div>
    )
}