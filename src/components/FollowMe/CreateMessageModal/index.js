import React, { useState, useEffect } from 'react'
import MessageForm from '../MessageForm'
import VertiallyCenteredModal from '../../VerticallyCenteredModal'
import { useFollowMeContext } from '../../../contexts/FollowMe'
import { Modal, Button } from 'react-bootstrap'

function Hesitate({onCancel, onDiscard}){
  return (
    <>
    <Modal.Header>
      <Modal.Title>
        Done?
      </Modal.Title>
    </Modal.Header>
    <Modal.Body>
      Discarding your message can't be undone. You'll lose your message
    </Modal.Body>
    <Modal.Footer>
      <Button onClick={onCancel} variant="secondary">Cancel</Button><Button onClick={onDiscard} variant="danger">Discard</Button>
    </Modal.Footer>
    </>
  )
}

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

  return (
    <Modal
      show={Boolean(showCreate)}
      onHide={() => setShowHesitate(true)}
      aria-labelledby='contained-modal-title-vcenter'
      centered
    >
      {!showHesitate && (
        <Modal.Header closeButton />
      )}
      <div style={{display: showHesitate ? 'none' : 'block'}}><MessageForm replyid={replyid} onSubmitted={() => actions.setShowCreate(false)}/></div>
      {showHesitate && <Hesitate onCancel={()=>setShowHesitate(false)} onDiscard={()=>setClose(true)} /> }
    </Modal>
  )
}
