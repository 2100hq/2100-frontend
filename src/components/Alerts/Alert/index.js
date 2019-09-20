import React, { useRef, useState, useEffect } from 'react'
import { toDecimals } from '../../../utils'
import './style.scss'
const timeout = 7500
export default function Alert ({ command, index, total }) {
  const [show, setShow] = useState(true)
  const prev = useRef(command)

  useEffect(() => {
    if (command.done === prev.current.done && command.done) return
    setShow(true)
    setTimeout(() => setShow(false), timeout)
  }, [command.done])

  if (command.state === 'Submitted') return null
  if (command.done === prev.current.done && command.done) return null // previously `done` so no need to show

  if (!show) return null

  let action
  let status
  let value = toDecimals(command.value)

  if (/deposit/.test(command.type)) {
    action = 'deposit'
  }
  // if (/withdrawPrimary/.test(command.type)) {
  //   action = 'withdrawal'
  // }
  if (command.done) {
    status = 'complete'
  } else {
    status = 'pending'
  }

  return (
    <div
      className='alert alert-light alert-shadow alert-dismissible fade show'
      role='alert'
    >
      <h5 className='alert-heading'>
        <strong>
          <em>2100: Alert</em>
        </strong>
      </h5>
      <hr />
      <p>
        Your <img src='../img/dai.png' style={{ width: '20px' }} />{' '}
        <strong>{value}</strong> {action} is {status}!
      </p>
      <button
        type='button'
        className='close'
        data-dismiss='alert'
        aria-label='Close'
        onClick={() => setShow(false)}
      >
        <span aria-hidden='true'>&times;</span>
      </button>
    </div>
  )
}
