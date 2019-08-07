import React from 'react'
import './style.scss'
import Button from 'react-bootstrap/Button'
export default function AssetBadge (props) {

	return(
			<a className={"asset-badge " + props.color } href="">${props.name}</a>
		)
}