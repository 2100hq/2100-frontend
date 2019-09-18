import React, { useState, useEffect } from 'react'
import MessageForm from '../MessageForm'
import VertiallyCenteredModal from '../../VerticallyCenteredModal'
import { useFollowMeContext } from '../../../contexts/FollowMe'
import { Modal, Button, Container, Row, Col } from 'react-bootstrap'
import './style.scss'

// function Hesitate({onCancel, onDiscard}){
//   return (
//     <>
//     <Modal.Header>
//       <Modal.Title>
//         Done?
//       </Modal.Title>
//     </Modal.Header>
//     <Modal.Body>
//       Discarding your message can't be undone. You'll lose your message
//     </Modal.Body>
//     <Modal.Footer>
//       <Button onClick={onCancel} variant="secondary">Cancel</Button><Button onClick={onDiscard} variant="danger">Discard</Button>
//     </Modal.Footer>
//     </>
//   )
// }

export default function CreateMessageModal () {
  const { showCreate, actions } = useFollowMeContext()

  const [showHesitate, setShowHesitate] = useState(false)
  const [close, setClose] = useState(false)

  useEffect( () => {
    if (!close) return
    actions.setShowCreate(false)
    setClose(false)
    setShowHesitate(false)
  }, [close])

  const {replyid} = showCreate
  const show= Boolean(showCreate)
  if (!show) return null
  return (
    <div className='fixed-message-form'>
      <div style={{position: 'relative'}}>
        <Container>
          <Row className='compose-header small'>
            <Col>
              <h5 className="mt-3 mb-3">Compose</h5>
              <i class="fas fa-times-circle close" onClick={ () =>  actions.setShowCreate(false)}/>
            </Col>
          </Row>
          <Row>
            <Col>
                <MessageForm replyid={replyid} onSubmitted={() => actions.setShowCreate(false)}/>
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  )
}
