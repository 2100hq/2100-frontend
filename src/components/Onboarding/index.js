import React from 'react';
import {Modal,Button,Col,Row} from 'react-bootstrap';
import './style.scss';

function HiddenMessageExample(){
  const message_id = '0f2e0687-65d7-4372-a18b-0270b94abbc9'
  const id = message_id.replace(/-/g,'').toUpperCase().split('').map( c => <span className={`char-${c}`}>{c} </span>)

  return(
    <div className='hidden-message-block'>
      <div className='pretend-encryption'>
        {id} {id}
      </div>
    </div>
  )
}

export default function Onboarding(){
    return (
      <Modal
        aria-labelledby="contained-modal-title-vcenter"
        show={true}
        className='onboarding'
      >
        <Modal.Body>
        <div className='container'>
        <Row>
          <Col md='8'>
            <img src='img/logo3.png' />
            <h1>Welcome to 2100</h1>
            <ol>
              <li>Your Twitter account has 2100 tokens</li>
              <li>Others stake DAI to earn your tokens because...</li>
              <li>You post hidden messages that only your token holders can see!</li>
            </ol>
            <h4>Here's a hidden message from $vitalik</h4>
            <HiddenMessageExample />
          </Col>
        </Row>
        </div>
        </Modal.Body>
      </Modal>
  )
}