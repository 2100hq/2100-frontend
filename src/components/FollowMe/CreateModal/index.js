import React, { useState, useEffect } from 'react'
import MessageForm from '../MessageForm'
import VertiallyCenteredModal from '../../VerticallyCenteredModal'
import { useFollowMeContext } from '../../../contexts/FollowMe'
import { Modal, Button } from 'react-bootstrap'

export default function CreateModal ({show,onHide}) {
  const { state, actions } = useFollowMeContext()

  const modalProps = {
    show,
    body: <p>hi</p>,
    onHide
  }
  return (
    <Modal
      show={show}
      onHide={onHide}
      size='lg'
      aria-labelledby='contained-modal-title-vcenter'
      centered
    >
      <MessageForm/>
    </Modal>
  )
}
