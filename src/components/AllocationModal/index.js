import React, { useState, useEffect, useMemo } from 'react'
import { useStoreContext } from '../../contexts/Store'
import { Modal, Button } from 'react-bootstrap'
import AllocateMultiple from '../AllocateMultiple'

import './style.scss'

function Hesitate({onCancel, onDiscard}){
  return (
    <React.Fragment>
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
    </React.Fragment>
  )
}

export default function AllocationModal(){
  const [showHesitate, setShowHesitate] = useState(false)
  const [close, setClose] = useState(false)

  const { query } = useStoreContext()
  let isEditing = query.getIsEditingAllocations()
  const isSignedIn = query.getIsSignedIn()
  let editingTokenId = isEditing&&isEditing.tokenid

  useEffect( () => {
    if (!close) return
    query.setIsEditing({})
    setClose(false)
    setShowHesitate(false)
  }, [close])

  function onHide(){
    if (query.getIsAllocating()) return
    query.setIsEditing({})
  }

  return (
    <Modal
      show={Boolean(editingTokenId)}
      onHide={onHide}
      aria-labelledby='contained-modal-title-vcenter'
      centered
      animation={false}
      backdrop={true}
      backdropClassName={'allocate-backdrop'}
      size='lg'
    >
      {!showHesitate && (
        <Modal.Header closeButton>
          <div className='row'>
            <div className='col-md-12'>
              <h3>Stake</h3>
              <p>Rewards are generated for every 2100 asset approximately once per minute. Allocate your DAI to an asset to claim a percentage of the reward. ie. </p>
            </div>
          </div>
        </Modal.Header>
      )}
      <div style={{display: showHesitate ? 'none' : 'block'}}>
         <AllocateMultiple />
      </div>
      {showHesitate && <Hesitate onCancel={()=>setShowHesitate(false)} onDiscard={()=>setClose(true)} /> }
    </Modal>
  )
}