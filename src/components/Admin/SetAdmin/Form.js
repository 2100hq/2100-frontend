import React, { useState, useEffect } from 'react'
import { Form, InputGroup, Button } from 'react-bootstrap'

export default function SetAdminForm ({ onSubmit }) {
  const [validated, setValidated] = useState(false)
  const [data, setData] = useState({})

  const handleChange = event => {
    const input = event.target
    const value =
      input.type === 'checkbox'
        ? input.checked
        : (input.value || '').toLowerCase()
    setData({ ...data, [input.id]: value })
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
      <Form.Group controlId='address'>
        <Form.Label className='sr-only'>Address</Form.Label>
        <InputGroup>
          <Form.Control
            type='text'
            placeholder='Address'
            aria-describedby='inputGroupPrepend'
            pattern='^0x[a-fA-F0-9]+'
            required
            onChange={handleChange}
          />
          <Form.Control.Feedback type='invalid'>
            Please provide a valid Ethereum Address
          </Form.Control.Feedback>
        </InputGroup>
      </Form.Group>
      <Form.Group controlId='isAdmin'>
        <Form.Check type='checkbox' label='Admin' onChange={handleChange} />
      </Form.Group>
      <Button type='submit'>
        <i className='fas fa-edit' /> Submit
      </Button>
    </Form>
  )
}
