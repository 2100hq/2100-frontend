import React, { Component }  from 'react'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowsAltH, faLongArrowAltUp, faStar } from '@fortawesome/free-solid-svg-icons'
import { faStar as faStarReg } from '@fortawesome/free-regular-svg-icons'

import Allocator from '../Allocator'
import './style.scss'

function filterAssets(state, assets, user) {
    const searchCond = state.search ? a => state.search.test(a.asset) : () => true
    const categoryCond = state.category === "Favorites" 
        ? a => user.favorites.includes(a.asset)
        : state.category && state.category !== 'All' ? a => a.categories.includes(state.category) : () => true

    return assets.filter(a => searchCond(a) && categoryCond(a))
}

function SearchCategory({ category, select, state }) {
    const selected = category === state.category
    return (
        <span onClick={select} className={`search-category search-category-selected-${selected}`}>{category}</span>
    )
}

function Favorite({ user, asset, toggleFav }) {
    if (user.favorites.includes(asset.asset)) {
        return <div className="favorite"><FontAwesomeIcon icon={faStar} onClick={() => toggleFav(asset.asset)}/></div>
    } else {
        return <div className="favorite"><FontAwesomeIcon icon={faStarReg} onClick={() => toggleFav(asset.asset)}/></div>
    }
}

class Index extends Component {
    constructor() {
        super()
        this.state = {
            search: null,
            category: null
        }
    }

    updateSearch = e => {
        this.setState({ search: new RegExp(e.target.value, 'i') })
    }

    selectCategory = e => {
        const val = e.target.innerText
        const category = val || null 
        this.setState({ category })
    }

    render() {
        const assets = filterAssets(this.state, this.props.assets, this.props.user)
        return (
            <div className="Assets container-fluid">
                <div className="row">
                    <div className="col-sm-8">
                        <div className="Discover">
                            <div className="Discover-header">Discover</div>
                            <div className="Discover-search">
                                <span className="user-search">
                                    <input placeholder="username" onChange={this.updateSearch} />
                                </span>
                                <SearchCategory category="All" state={this.state} select={this.selectCategory} />
                                <SearchCategory category="Crypto Twitter" state={this.state} select={this.selectCategory} />
                                <SearchCategory category="Favorites" state={this.state} select={this.selectCategory} />
                            </div>
                        </div>
                        <div className="Assets-table">
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th scope="col">Asset</th>
                                        <th scope="col">Staked</th>
                                        <th scope="col">Allocate</th>
                                        <th scope="col"></th>
                                    </tr>
                                </thead>
                                <tbody>
                                {assets.map(asset => (
                                    <tr key={asset.asset}>
                                        <td>
                                            <img src={`https://res.cloudinary.com/dhvvhdndp/image/twitter_name/${asset.asset}`}></img>
                                            &nbsp;&nbsp;<i><Link to={`/a/${asset.asset}`}>@{asset.asset}</Link></i>
                                        </td>
                                        <td>{asset.staked}</td>
                                        <td><Allocator {...this.props} asset={asset} /></td>
                                        <td><Favorite {...this.props} asset={asset}  /></td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div className="col-sm-4">
                        <div className="Featured">
                            <img src="https://www.ccn.com/wp-content/uploads/2018/04/Vitalik-Buterin-e1522675308283.jpg" className="img-fluid" alt="Responsive image"></img>
                            <div className="Featured-body">
                                <b>$twitter:VitalikButerin</b>
                                <p>Creator of the Ethereum Smart Contract Platform</p>
                                <div className="Featured-stats">
                                    <p>Followers: 130k <span className="float-right"><FontAwesomeIcon icon={faArrowsAltH} /> 2</span></p>
                                    <p>Staked: ◈ 25,000 <span className="float-right"><FontAwesomeIcon icon={faLongArrowAltUp} /> 1</span></p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default Index