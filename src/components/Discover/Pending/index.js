import React from 'react'
import { useStoreContext } from '../../../contexts/Store'
import { OverlayTrigger, Tooltip } from 'react-bootstrap'

function Row ({token, onClick = ()=>{}}) {

  function handleClick(e){
    e.preventDefault()
    onClick(token)
  }

  const icon = (
    <OverlayTrigger
      placement='top'
      overlay={<Tooltip id='tooltip-top'>
        <em>
          Asset is a valid Twitter handle but is awaiting contract creation.
        </em>
      </Tooltip>}
    >
      <i className='fas fa-sync-alt text-warning' />
    </OverlayTrigger>
  )
  return (
    <tr>
      <th scope='row'>
        {token.name}
      </th>
      <td>{icon}</td>
      <td>
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
          <a href='#' onClick={handleClick}>
            <small>Initialize and Earn</small>
          </a>
        </OverlayTrigger>
      </td>
    </tr>
  )
}

export default function Pending({tokens}){
  const { state, dispatch, actions } = useStoreContext()

  function createCoupon(token){
    return dispatch(actions.useCreateCoupon(token.coupon))
  }

  const rows = tokens.map(token => (
    <Row
      token={token}
      key={token.name}
      onClick={createCoupon}
    />
  ))

  return (
    <table className='table table-hover table-borderless'>
      <thead className='text-muted'>
        <tr>
          <th>User</th>
          <th></th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>{rows}</tbody>
    </table>
  )
}