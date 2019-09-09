import React from 'react';
import {Modal,Button,Col,Row} from 'react-bootstrap';
import './style.scss';

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
            <h1 style={{marginTop: '3rem'}}>Welcome to 2100</h1>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque vel risus euismod, laoreet turpis sit amet, volutpat nulla. Praesent consectetur eu mauris sed rhoncus.</p>
          </Col>
        </Row>
        </div>
        </Modal.Body>
      </Modal>
  )
}