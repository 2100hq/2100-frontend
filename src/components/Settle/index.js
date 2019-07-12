import React, { Component } from 'react'
import { Link } from 'react-router-dom'

import './style.scss'

class Settle extends Component {
    constructor() {
        super()

        this.state = {}
    }

    render() {
        return (
            <div className="col-md-8 offset-md-2 Settle">
                <table className="table">
                    <thead>
                        <tr>
                            <th>Asset</th>
                            <th>Available</th>
                            <th>Action</th>
                            <th>Pending</th>
                            <th>0xabc</th>
                            <th>Total Minted</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Object.entries(this.props.user.minted).map(([username, minted]) => {
                            return (
                                <tr key={username}>
                                    <td>
                                        <img src={`https://res.cloudinary.com/dhvvhdndp/image/twitter_name/${username}`}></img>
                                        &nbsp;&nbsp;<i><Link to={`/a/${username}`}>@{username}</Link></i>
                                    </td>
                                    <td>{minted.available}</td>
                                    <td><SettleButton minted={minted} /></td>
                                    <td>{minted.pending}</td>
                                    <td></td>
                                    <td>{minted.total}</td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
        )
    }
}

function SettleButton ({ minted }) {
    if (minted.available > 0) {
        return <button className="Settle-button">Settle to ERC20</button>
    } else {
        return null
    }
}

export default Settle