import React, { useState, useEffect } from 'react'
import { Form, InputGroup, Button } from 'react-bootstrap'

export default function CreateTokenForm ({ onSubmit }) {
  const [validated, setValidated] = useState(false)
  const [data, setData] = useState({})

  const handleChange = event => {
    const input = event.target
    setData({ ...data, [input.id]: (input.value || '').toLowerCase() })
  }
  const handleSubmit = event => {
    setValidated(true)
    const form = event.currentTarget
    event.preventDefault()
    event.stopPropagation()
    if (form.checkValidity() === false) {
      return
    }
    onSubmit(data)
  }

  return (
    <Form noValidate validated={validated} onSubmit={handleSubmit}>
      <Form.Group controlId='username'>
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
            maxLength='15'
            required
            onChange={handleChange}
          />
          <Form.Control.Feedback type='invalid'>
            Please provide a valid username
          </Form.Control.Feedback>
        </InputGroup>
      </Form.Group>
      <Form.Group controlId='address'>
        <Form.Label className='sr-only'>address</Form.Label>
        <InputGroup>
          <Form.Control
            type='text'
            placeholder='Ethereum Address'
            aria-describedby='inputGroupPrepend'
            pattern='^0x[a-fA-F0-9]+'
            required
            onChange={handleChange}
          />
          <Form.Control.Feedback type='invalid'>
            Please provide a valid address
          </Form.Control.Feedback>
        </InputGroup>
      </Form.Group>
      <Button type='submit'>
        <i className='fas fa-edit' /> Submit
      </Button>
    </Form>
  )
}
