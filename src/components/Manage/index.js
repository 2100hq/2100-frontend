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

function StepOne({next, publicAddress}){
  return (
    <div>
      <h5>Get your own token</h5>
      <ol>
      <li>
        <p>
          Post a new tweet linking your Twitter username to {publicAddress}
          <br/><span className='text-muted'>Or use a previous <a href='https://humanitydao.org' target='_blank' className='text-muted'>HumanityDAO</a> tweet</span>
        </p>
      </li>
      <li>Paste a link to your tweet</li>
      </ol>
      <Button onClick={next}>Next</Button>
    </div>
  )
}

function StepTwo({next, publicAddress}){
  return (
    <div>
      <TweetContent publicAddress={publicAddress} />
      <Button onClick={next}>Next</Button>
    </div>
  )
}

export default function Manage (props) {
  const [username, setUsername] = useState()
  const { state, query, dispatch, actions } = useStoreContext()
  const [step, setStep] = useState(1)
  if (!state.private.isSignedIn) return <Redirect to={{
      pathname: '/',
      state: { from: props.location }
    }} />

  const publicAddress = query.getUserAddress()

  const steps = {
    [1]: (props) => <StepOne {...props} />,
    [2]: (props) => <StepTwo {...props} />
  }

  function next(){
    let nextStep = step+1
    if (nextStep > Object.keys(steps).length) nextStep = 1
    setStep(nextStep)
  }
  return (
    <div className='row'>
      <div className='col-md-5'>
        <div className='card'>
          <div className='card-body'>
            {steps[step]({publicAddress, next})}
          </div>
        </div>
      </div>
    </div>
  )
}
