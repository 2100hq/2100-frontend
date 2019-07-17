import React from 'react'
import { useWeb3Context } from 'web3-react'
import { Link } from 'react-router-dom'
import Jazzicon, { jsNumberForAddress } from 'react-jazzicon'

import './style.scss'

function Header (props) {
    const web3 = useWeb3Context()

    return (
        <header className="Header">
            <span className="brand">2100</span>
            <span className="nav-pill"><Link to="/">Discover</Link></span>
            <span className="nav-pill"><Link to="/portfolio">Portfolio</Link></span>
            <span className="nav-pill"><Link to="/sync">Sync</Link></span>
            <span className="nav-pill"><Link to="/settle">Settle</Link></span>
            <span className="balance">
                <span>
                    <div>{props.user.used} / {props.user.total} DAI </div>
                    <UserIcon web3={web3} />
                </span>
            </span>
        </header>
    )
}

function UserIcon({ web3 }) {
    if (web3 && web3.account) {
        return (
            <Jazzicon diameter={30} seed={jsNumberForAddress(web3.account)} />
        )
    } else {
        return <div className="empty-jazzicon"></div>
    }
}

export default Header
