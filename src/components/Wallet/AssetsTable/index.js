import React, {useState, useEffect } from 'react'
import { useStoreContext } from '../../../contexts/Store'
import { toDecimals } from '../../../utils'
import { sortBy } from 'lodash'
import { useCountUp } from 'react-countup';

function Row({token}){
  const { countUp, update } = useCountUp({
      start: 0,
      end: token.balance,
      delay: 0,
      decimals: 8,
      duration: 0.25,
      onReset: () => console.log('Resetted!'),
      onUpdate: () => console.log('Updated!'),
      onPauseResume: () => console.log('Paused or resumed!'),
      onStart: ({ pauseResume }) => console.log(pauseResume),
      onEnd: ({ pauseResume }) => console.log(pauseResume),
    });
  useEffect( () => {
    update(token.balance)
  }, [token.balance])
  return (
    <tr key={token.name}>
    <td>{token.name}</td>
    <td>{countUp}</td>
    </tr>
  )
}

export default function AssetsTable(){
  const { state } = useStoreContext()
  const [hide, setHide] = useState(true)
  let tokens = Object.values(state.tokens || {}).filter(token => !token.pending).map( token => ({name: token.name, balance: toDecimals(token.balances.available)}))
  if (hide){
    tokens = tokens.filter( token => Boolean(Number(token.balance)) )
  }
  const rows = sortBy(tokens, token => token.name).map( token => <Row token={token} />)
  return (
      <div className='card mt-3'>
      <div className='card-body'>
        <table className='table table-sm'>
          <thead>
            <tr>
              <th scope='col'>Asset</th>
              <th scope='col'>Amount</th>
              <th>
              <input
                name="hide"
                type="checkbox"
                checked={hide}
                onChange={ e => setHide(e.target.checked )}
              />
              Hide zero balances</th>
            </tr>
          </thead>
          <tbody>
          { rows }
          </tbody>
        </table>
      </div>
    </div>
  )
}