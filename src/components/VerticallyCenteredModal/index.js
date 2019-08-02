import React from 'react'
import { Modal, Button } from 'react-bootstrap'
export default function VerticallyCenteredModal (props) {
  return (
    <Modal
      {...props}
      size='lg'
      aria-labelledby='contained-modal-title-vcenter'
      centered
    >
      {props.title ? (
        <Modal.Header closeButton>
          <Modal.Title id='contained-modal-title-vcenter'>
            {props.title}
          </Modal.Title>
        </Modal.Header>
      ) : null}
      <Modal.Body>
        {props.heading ? <h4>{props.heading}</h4> : null}
        {props.body ? <p>{props.body}</p> : null}
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={props.onHide || props.onClose}>Close</Button>
      </Modal.Footer>
    </Modal>
  )
}
