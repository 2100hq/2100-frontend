import React, { useState, useEffect } from 'react'
import { Modal } from 'react-bootstrap'
import { useStoreContext } from '../../../contexts/Store'
import SingleMessage from '../SingleMessage'
import history from '../../../utils/history'

export default function MessageModal({match}){
  const {username, messageid} = match.params
  const { query } = useStoreContext()
  const isSignedIn = query.getIsSignedIn()

  const token = query.getToken(username)
  if (isSignedIn) return null
  const hide = () => history.push(`/${username}`)
   return (
     <Modal
       show={true}
       aria-labelledby='contained-modal-title-vcenter'
       centered
       onHide={hide}
       animate={false}
     >
      <Modal.Header>
        <i class="fas fa-times-circle" style={{position: 'absolute', top: '0.25rem', right: '0.25rem', cursor: 'pointer'}} onClick={hide}></i>
      </Modal.Header>
      <SingleMessage messageid={messageid} token={token} canCopyUrl={false}/>
     </Modal>
   )
}
