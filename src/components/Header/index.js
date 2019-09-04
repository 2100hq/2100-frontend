import React from 'react'
import { Link } from 'react-router-dom'
import { useStoreContext } from '../../contexts/Store'
import './style.scss'


function UserHeader(){
	return(
		<div className='user-header'></div>
	)
}

function MarketingHeader(){
	return(
	<UserHeader />
	)
}

export default function Header () {
	const { query } = useStoreContext()
	const isSignedIn = query.getIsSignedIn()
	if (!isSignedIn) return <MarketingHeader />
	return <UserHeader />
}