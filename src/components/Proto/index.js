import React from 'react'
import './style.scss'
import AssetBadge from '../AssetBadge'
export default function Proto () {
  return(
  	<div>
  		<ul class="badge-list">
	  		<li><AssetBadge name={"vitalik"} color={"green"} /></li>
	  		<li><AssetBadge name={"benjmnr"} color={"blue"}/></li>
	  		<li><AssetBadge name={"brttb"} color={"lightpurple"}/></li>
	  		<li><AssetBadge name={"elonmusk"} color={"darkpurple"} /></li>

  		</ul>
  	</div>
  ) 
}