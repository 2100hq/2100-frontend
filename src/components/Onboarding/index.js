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
            <div className='section section1'>
              <img src='img/logo3.png' />
              <h1>Welcome to 2100_</h1>
            </div>
            <div className='section section2'>
              <h4>How it works</h4>
              <ol>
                <li>Every Twitter account has 2100 tokens</li>
                <li>Others stake DAI to earn your tokens because...</li>
                <li>You post hidden messages that only your token holders can see!</li>
              </ol>
            </div>
            <div className='section section3'>
              <h4>Let's try it out</h4>
              <p>Below is a hidden message from $vitalik. Add some stake and earn enough $vitalik to reveal the message.</p>
              <div>
                <img src='../img/dai.png' style={{ width: '14px','vertical-align': 'baseline' }} /> 
                10 DAI 
                [][][][][][][][][]
              </div>
              <div>0 $vitalik</div>
                <HiddenMessageExample />
            </div>
            <div className='section section4'>
            <h4>Great job!</h4>
            <p>You're such an efficient capital allocator that we've credited 10 testnet DAI to your account.</p>
            <a href='/'>Sign in with Metamask</a>
            <p>and be among the first to experience 2100.</p>
            </div>
            </Col>
          </Row>
        </div>
        </Modal.Body>
      </Modal>
  )
}