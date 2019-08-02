import React, { useState, useEffect } from 'react'
import Form from './Form'
import { useStoreContext } from '../../../contexts/Store'

export default function SetAdmin () {
  const [data, setData] = useState({ isAdmin: false })
  const [done, setDone] = useState()
  const { dispatch, actions, state } = useStoreContext()
  useEffect(() => {
    console.log('setAdmin', data)
    if (!data.address) return
    dispatch(actions.setAdmin(data)).then(
      completed => completed && setDone(true)
    )
  }, [data])

  const reset = () => {
    setData({})
    setDone(false)
  }

  return (
    <div className='col-md-12'>
      <h5>Add/Remove Admin</h5>
      <p>Set an Ethereum address as an admin account</p>
      {done ? (
        <span>
          <hr />
          <h5>Added {data.address}!</h5>{' '}
          <a onClick={reset} href='#'>
            Add another
          </a>
        </span>
      ) : (
        <Form onSubmit={setData} {...data} />
      )}
    </div>
  )
}
