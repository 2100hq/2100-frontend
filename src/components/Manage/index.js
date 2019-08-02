import React, { useState, useEffect } from 'react'
import { Redirect } from 'react-router-dom'
import { Form, InputGroup, Button } from 'react-bootstrap'
import { useStoreContext } from '../../contexts/Store'
import './style.scss'

function CreateForm ({ onSubmit }) {
  const [validated, setValidated] = useState(false)
  const [username, setUsername] = useState()
  const handleChange = event => {
    setUsername(event.target.value)
  }
  const handleSubmit = event => {
    setValidated(true)
    const form = event.currentTarget
    event.preventDefault()
    event.stopPropagation()
    if (form.checkValidity() === false) {
      return
    }
    onSubmit(username)
  }

  return (
    <Form noValidate validated={validated} onSubmit={handleSubmit}>
      <Form.Group controlId='validationCustomUsername'>
        <Form.Label className='sr-only'>Username</Form.Label>
        <InputGroup>
          <InputGroup.Prepend>
            <InputGroup.Text id='inputGroupPrepend'>@</InputGroup.Text>
          </InputGroup.Prepend>
          <Form.Control
            type='text'
            placeholder='Username'
            aria-describedby='inputGroupPrepend'
            pattern='[a-zA-Z_0-9]+'
            maxlength='15'
            required
            onChange={handleChange}
          />
          <Form.Control.Feedback type='invalid'>
            Please provide a valid username
          </Form.Control.Feedback>
        </InputGroup>
      </Form.Group>
      <Button type='submit'>
        <i className='fas fa-edit' /> Sign
      </Button>
    </Form>
  )
}

function TweetContent ({ publicAddress }) {
  return (
    <div>
      <div className='tweet-content'>Add me @2100hq: {publicAddress}</div>
      <Button>Tweet</Button>
    </div>
  )
}

export default function Manage () {
  const [username, setUsername] = useState()
  const { state, dispatch, actions } = useStoreContext()
  if (!state.private.isSignedIn) return <Redirect to='/' />
  const publicAddress =
    state.private && state.private.me && state.private.me.publicAddress

  return (
    <div className='row'>
      <div className='col-md-5'>
        <div className='card'>
          <div className='card-body'>
            <ul className='nav nav-pills'>
              {/* <li className='nav-item'>
                              <a className='nav-link active'>Create</a>
                            </li> */}
            </ul>
            <div className='card-body'>
              <div className='row'>
                <div className='col-md-12'>
                  <h5>Create your 2100</h5>
                  <p>
                    To create the 2100 asset for an account that you own, tweet
                    this message.
                  </p>
                  <TweetContent publicAddress={publicAddress} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
