import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faArrowsAltH,
  faLongArrowAltUp,
  faStar
} from '@fortawesome/free-solid-svg-icons'
import { faStar as faStarReg } from '@fortawesome/free-regular-svg-icons'
import * as d3 from 'd3'

import Allocator from '../Allocator'
import './style.scss'

function filterAssets (state, assets, user) {
  const searchCond = state.search ? a => state.search.test(a.asset) : () => true
  const categoryCond =
    state.category === 'Favorites'
      ? a => user.favorites.includes(a.asset)
      : state.category && state.category !== 'All'
      ? a => a.categories.includes(state.category)
      : () => true

  return assets.filter(a => searchCond(a) && categoryCond(a))
}

function SearchCategory ({ category, select, state }) {
  const selected = category === state.category
  return (
    <span
      onClick={select}
      className={`search-category search-category-selected-${selected}`}
    >
      {category}
    </span>
  )
}

function Favorite ({ user, asset, toggleFav }) {
  if (user.favorites.includes(asset.username)) {
    return (
      <div className='favorite'>
        <FontAwesomeIcon
          icon={faStar}
          onClick={() => toggleFav(asset.username)}
        />
      </div>
    )
  } else {
    return (
      <div className='favorite'>
        <FontAwesomeIcon
          icon={faStarReg}
          onClick={() => toggleFav(asset.username)}
        />
      </div>
    )
  }
}

const formatNum = d3.format('~s')

class Index extends Component {
  constructor () {
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

  render () {
    const assets = filterAssets(this.state, this.props.assets, this.props.user)
    return (
      <div className='Assets container-fluid'>
        <div className='row'>
          <div className='col-sm-8'>
            <div className='Discover'>
              <div className='Discover-header'>Discover</div>
              <div className='Discover-search'>
                <span className='user-search'>
                  <input placeholder='username' onChange={this.updateSearch} />
                </span>
                <SearchCategory
                  category='All'
                  state={this.state}
                  select={this.selectCategory}
                />
                <SearchCategory
                  category='Crypto Twitter'
                  state={this.state}
                  select={this.selectCategory}
                />
                <SearchCategory
                  category='Favorites'
                  state={this.state}
                  select={this.selectCategory}
                />
              </div>
            </div>
            <div className='Assets-table'>
              <table className='table'>
                <thead>
                  <tr>
                    <th scope='col'>Asset</th>
                    <th scope='col' className='align-right'>
                      Total Staked
                    </th>
                    <th scope='col' className='align-right'>
                      My Stake
                    </th>
                    <th scope='col'>Allocate</th>
                    <th scope='col' />
                  </tr>
                </thead>
                <tbody>
                  {assets.map(asset => (
                    <tr key={asset.username}>
                      <td>
                        <img
                          src={`https://res.cloudinary.com/dhvvhdndp/image/twitter_name/${
                            asset.username
                          }`}
                          alt='#'
                        />
                        &nbsp;&nbsp;
                        <i>
                          <Link to={`/a/${asset.username}`}>
                            @{asset.username}
                          </Link>
                        </i>
                      </td>
                      <td className='align-right'>{formatNum(asset.staked)}</td>
                      <td className='align-right'>
                        {this.props.user.totalStakes[asset.username]}
                      </td>
                      <td>
                        <Allocator {...this.props} asset={asset} />
                      </td>
                      <td>
                        <Favorite {...this.props} asset={asset} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className='col-sm-4'>
            <div className='Featured'>
              <img
                src='https://www.ccn.com/wp-content/uploads/2018/04/Vitalik-Buterin-e1522675308283.jpg'
                className='img-fluid'
                alt='#'
              />
              <div className='Featured-body'>
                <b>$twitter:{this.props.featured.username}</b>
                <p>{this.props.featured.description}</p>
                <div className='Featured-stats'>
                  <p>
                    Followers: {formatNum(this.props.featured.followers)}{' '}
                    <span className='float-right'>
                      <FontAwesomeIcon icon={faArrowsAltH} /> 2
                    </span>
                  </p>
                  <p>
                    Staked: ◈ {formatNum(this.props.featured.minting)}{' '}
                    <span className='float-right'>
                      <FontAwesomeIcon icon={faLongArrowAltUp} /> 1
                    </span>
                  </p>
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
