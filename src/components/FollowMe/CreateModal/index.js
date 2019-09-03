import React, { useState, useEffect } from 'react'
import MessageForm from '../MessageForm'
import VertiallyCenteredModal from '../../VerticallyCenteredModal'
import { useFollowMeContext } from '../../../contexts/FollowMe'
import { Modal, Button } from 'react-bootstrap'

function Hesitate({onCancel, onDisgard}){
  return (
    <>
    <Modal.Header>
      <Modal.Title>
        Disgard?
      </Modal.Title>
    </Modal.Header>
    <Modal.Body>
      This can't be undone and you'll lose your message
    </Modal.Body>
    <Modal.Footer>
      <Button onClick={onCancel} variant="secondary">Cancel</Button><Button onClick={onDisgard} variant="danger">Disgard</Button>
    </Modal.Footer>
    </>
  )
}

export default function CreateModal ({show,onHide}) {
  const { state, actions } = useFollowMeContext()
  const [showHesitate, setShowHesitate] = useState(false)
  const [close, setClose] = useState(false)

  useEffect( () => {
    if (!close) return
    onHide()
    setClose(false)
    setShowHesitate(false)
  }, [close])

  return (
    <Modal
      show={show}
      onHide={() => setShowHesitate(true)}
      size='lg'
      aria-labelledby='contained-modal-title-vcenter'
      centered
    >
      {!showHesitate && (
        <Modal.Header closeButton />
      )}
      <div style={{display: showHesitate ? 'none' : 'block'}}><MessageForm onSubmitted={onHide}/></div>
      {showHesitate && <Hesitate onCancel={()=>setShowHesitate(false)} onDisgard={()=>setClose(true)} /> }
    </Modal>
  )
}
