import React, { useState, useEffect } from 'react'
import Form from './Form'
import { useStoreContext } from '../../../contexts/Store'

export default function AllowUsername () {
  const [data, setData] = useState({})
  const [done, setDone] = useState()
  const { dispatch, actions, state } = useStoreContext()
  useEffect(() => {
    if (!data.username || !data.address) return
    dispatch(actions.allowUsername(data)).then(
      completed => completed && setDone(true)
    )
  }, [data])

  const reset = () => {
    setData({})
    setDone(false)
  }

  return (
    <div className='col-md-12'>
      <h5>Generate a Create Token Coupon</h5>
      <p>Verify that the username tweeted the "Add me" message</p>
      <p>
        The server will take care of verifying that the user signed the correct
        message and will set the owners address
      </p>
      {done ? (
        <span>
          <hr />
          <h5>Added {data.username}!</h5>{' '}
          <a onClick={reset} href='#'>
            Add another
          </a>
        </span>
      ) : (
        <Form onSubmit={setData} />
      )}
    </div>
  )
}
