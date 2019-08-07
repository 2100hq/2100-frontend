import React, { useState, useEffect } from 'react'
import { Redirect } from 'react-router-dom'
import { useStoreContext } from '../../contexts/Store'
import { BN } from '../../utils'
import {Nav} from 'react-bootstrap'
import { RadialChart} from 'react-vis'
import Allocator from '../Allocator'

export default function Portfolio (props) {
  const { state } = useStoreContext()
  const [chartName, setChartName] = useState('minting')
  const [chartData, setChartData] = useState([])

  useEffect(() => {
    const tokens = Object.values((state.tokens || {})).filter(token => {
      if (token.pending) return false
      if (chartName === 'minting') {
        return BN(token.myStake).gt(0)
      } else {
        return BN(token.balances.available).gt(0)
      }
    })

    setChartData(tokens.map(token => {
      return {
        angle: chartName === 'minting' ? token.myStake : token.balances.available,
        label: '$' + token.name
      }
    }))
  }, [chartName, state.tokens])

  if (!state.private.isSignedIn) {
    return <Redirect to={{
      pathname: '/',
      state: { from: props.location }
    }} />
  }
  const rows = Object.values((state.tokens || {})).filter(token => !token.pending).map(token => {
    return (
      <tr>
        <td>${token.name}</td>
        <td><Allocator token={token} /></td>
      </tr>
    )
  })
  return (
    <div className='container-fluid'>
      <div className='row'>
        <div className='col-md-8'>
          <div className='card'>
            <div className='card-body'>
              <h3>{state.web3.account.slice(0, 7)}</h3>
              <Nav variant='pills' defaultActiveKey={chartName} onSelect={setChartName}>
                <Nav.Item>
                  <Nav.Link eventKey='minting'>Minting</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey='hodling'>Hodling</Nav.Link>
                </Nav.Item>
              </Nav>
              <RadialChart
                data={chartData}
                width={300}
                height={300}
                labelsRadiusMultiplier={1.1}
                labelsStyle={{fontSize: 16, fill: '#222'}}
                showLabels
                labelsRadiusMultiplier={0.5}
                labelsStyle={{color: '#fff'}}
                style={{stroke: '#fff', strokeWidth: 2}}
                animation
                margin={{top: 100}}
                innerRadius={99}
              />
            </div>
          </div>
        </div>
        <div className='col-md-4'>
          <table class='table'>
            <thead>
              <tr>
                <th scope='col'>Asset</th>
                <th scope='col'>Allocation</th>
                <th scope='col' />
              </tr>
            </thead>
            <tbody>
              {rows}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
