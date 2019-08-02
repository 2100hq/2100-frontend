import React, { useState } from 'react'
import { useStoreContext } from '../../contexts/Store'
import { sortBy } from 'lodash'
import { OverlayTrigger, Tooltip } from 'react-bootstrap'

const DiscoverOptions = {
  All: {
    filter: tokens => {
      tokens = tokens.filter(token => !token.pending)
      tokens = sortBy(tokens, token => {
        return token.stakes.balance
      })
      return tokens
    },
    statusIconClass: 'fa-check text-success',
    statusTooltip: (
      <small>
        Undisputed <br />
        Owners Reward Claimed
      </small>
    ),
    columns: props => [
      null,
      null,
      null,
      <span>
        <img src='../img/dai.png' style={{ width: '16px' }} />{' '}
        {props.token.stakes.balance}
      </span>,
      <form style={{ width: '50%' }}>
        <div className='form-group'>
          <input
            type='range'
            className='form-control-range'
            id='formControlRange'
          />
        </div>
      </form>
    ]
  },
  Pending: {
    filter: tokens => {
      tokens = tokens.filter(token => token.pending)
      tokens = sortBy(tokens, token => {
        return token.name
      })
      return tokens
    },
    statusIconClass: 'fa-sync-alt text-warning',
    statusTooltip: (
      <em>
        Asset is a valid Twitter handle but is awaiting contract creation.
      </em>
    ),
    columnNames: ['   ', null, null, ' ', 'Action'],
    columns: props => [
      null,
      null,
      null,
      null,
      <OverlayTrigger
        placement='top'
        overlay={
          <Tooltip id='tooltip-top'>
            <em>
              Pay for contract creation and earn the first 10 block rewards!
            </em>
          </Tooltip>
        }
      >
        <a href='#' onClick={() => props.onClick(props)}>
          <small>Initialize and Earn</small>
        </a>
      </OverlayTrigger>
    ],
    onClick: ({ dispatch, actions, token }) =>
      dispatch(actions.useCreateCoupon(token.coupon)),
    Badge: ({ tokens, isActive }) => (
      <span
        className={`badge badge-${isActive ? 'light' : 'info'}`}
        style={{ marginLeft: '0.25em' }}
      >
        {DiscoverOptions.Pending.filter(tokens).length}
      </span>
    )
  },
  Favorites: {
    filter: tokens => {
      tokens = tokens.filter(
        token => !token.pending && token.myStake.balance > 0
      )
      tokens = sortBy(tokens, token => {
        return token.name
      })
      return tokens
    },
    show: state => state.private.isSignedIn
  }
}

function Row (props) {
  let { rank, token, statusIconClass, statusTooltip, columns, type } = props
  const icon = (
    <OverlayTrigger
      placement='top'
      overlay={<Tooltip id='tooltip-top'>{statusTooltip}</Tooltip>}
    >
      <i className={`fas ${statusIconClass}`} />
    </OverlayTrigger>
  )
  columns = columns ? columns(props) : []
  return (
    <tr>
      <th scope='row'>{rank}</th>
      <td>
        <a href='account.html'>${token.name}</a>
      </td>
      <td>{icon}</td>
      <td>{columns[3]}</td>
      <td>{columns[4]}</td>
      <td>
        <i className='far fa-star' />
      </td>
    </tr>
  )
}

function Tab (props) {
  const { name, isActive, onClick, tokens } = props
  const { Badge } = DiscoverOptions[name]
  const linkClasses = ['nav-link']
  if (isActive) linkClasses.push('active')

  return (
    <li className='nav-item'>
      <a className={linkClasses.join(' ')} onClick={onClick} href='#'>
        {name}
        {Badge ? <Badge {...props} /> : null}
      </a>
    </li>
  )
}

export default function Discover () {
  const { state, dispatch, actions } = useStoreContext()
  const tabNames = Object.keys(DiscoverOptions)
  const [active, setActive] = useState(tabNames[0])

  if (!state.tokens) return null

  let tokens = DiscoverOptions[active].filter(Object.values(state.tokens))

  const tabs = tabNames.map(name => {
    if (DiscoverOptions[name].show && !DiscoverOptions[name].show(state)) {
      return null
    }
    return (
      <Tab
        name={name}
        isActive={name === active}
        onClick={() => setActive(name)}
        key={name}
        tokens={Object.values(state.tokens)}
      />
    )
  })

  const rows = tokens.map((token, i) => (
    <Row
      rank={i + 1}
      token={token}
      type={active}
      key={token.name}
      dispatch={dispatch}
      actions={actions}
      {...DiscoverOptions[active]}
    />
  ))

  const headings = DiscoverOptions[active].columnNames || []
  return (
    <div className='row'>
      <div className='col-md-8' style={{ paddingTop: '1rem' }}>
        <div className='card' style={{ marginBottom: '1rem' }}>
          <h5 className='card-header'>Discover</h5>
          <div className='card-body'>
            <div className='row'>
              <div className='col-md-4'>
                <form className='form-inline'>
                  <label className='sr-only'>Username</label>
                  <div className='input-group mb-2 mr-sm-2'>
                    <div className='input-group-prepend'>
                      <div className='input-group-text'>$</div>
                    </div>
                    <input
                      type='text'
                      className='form-control'
                      id='inlineFormInputGroupUsername2'
                      placeholder='by username'
                    />
                  </div>
                </form>
              </div>
              <div className='col-md-8'>
                <ul className='nav nav-pills inline'>{tabs}</ul>
              </div>
            </div>
          </div>
        </div>

        <table className='table table-hover'>
          <thead>
            <tr>
              <th scope='col'>{headings[0] || 'Rank'}</th>
              <th scope='col'>{headings[1] || 'Asset'}</th>
              <th scope='col' />
              <th scope='col'>{headings[3] || 'Minting'}</th>
              <th scope='col'>{headings[4] || 'Allocate'}</th>
              <th scope='col' />
            </tr>
          </thead>
          <tbody>{rows}</tbody>
        </table>
      </div>
      <div className='col-md-4' style={{ paddingTop: '1rem' }}>
        <div className='row'>
          <div className='col-md-12'>
            <div className='card'>
              <img
                className='card-img-top'
                src='../img/vitalik.jpg'
                alt='Card image cap'
              />
              <div className='card-body'>
                <h5 className='card-title'>$vitalikbuterin</h5>
                <p className='card-text'>
                  Creator of the Ethereum smart contract platform.
                </p>
              </div>
              <ul className='list-group list-group-flush'>
                <li className='list-group-item'>1000 Followers</li>
                <li className='list-group-item'>6,000 Minting</li>
              </ul>
              <div className='card-body'>
                <a href='#' className='card-link'>
                  Stake $twitter:vitalikbuterin
                </a>
              </div>
            </div>
          </div>
        </div>
        <hr />
        <div className='row'>
          <div className='col-md-12'>
            <div className='card'>
              <div className='card-body'>
                <div className='small'>
                  <div>
                    <i className='fas fa-circle' style={{ color: 'green' }} />{' '}
                    Connected
                  </div>
                  <hr />
                  <div>Ethereum Mainnet</div>
                  <div>Block #8220171</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
