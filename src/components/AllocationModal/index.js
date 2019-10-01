import React, { useState, useEffect, useMemo } from 'react'
import { useStoreContext } from '../../contexts/Store'
import { Modal, Button } from 'react-bootstrap'
import Allocator from '../Allocator'
import ProfileImage from '../ProfileImage'
import LinkableName from '../LinkableName'
import Crown from '../Discover/Crown'
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

function Row({token}){
  return (
    <div className={"row no-gutters asset-row align-items-center"}>
      <div className='col-1' style={{textAlign: 'center'}}>
          <ProfileImage token={token} /><br/>
      </div>
      <div className="col-3" style={{overflow: 'hidden'}}>
        <LinkableName token={token} />
      </div>
      <div className="col-8">
        <Allocator token={token} className='allocator' />
      </div>
    </div>
  )
}

export default function AllocationModal(){
  const [showHesitate, setShowHesitate] = useState(false)
  const [close, setClose] = useState(false)
  const { state, query, actions } = useStoreContext()
  let isEditing = query.getIsEditingAllocations()
  const isSignedIn = query.getIsSignedIn()
  let editingTokenId = isEditing&&isEditing.tokenid
  const tokens = useMemo( () => {
    if (!editingTokenId) return []
    let tokens = {...query.getMyStakedTokens()}
    if (tokens[editingTokenId]){delete tokens[editingTokenId]}
    tokens = Object.keys(tokens)
    tokens.unshift(editingTokenId)
    return tokens.map(query.getToken)
  }, [isEditing, isSignedIn])

  const rows = tokens.map(token => <Row token={token} />)

  useEffect( () => {
    if (!close) return
    query.setIsEditing({})
    setClose(false)
    setShowHesitate(false)
  }, [close])


  return (
    <Modal
      show={Boolean(editingTokenId)}
      onHide={() => query.setIsEditing({})}
      aria-labelledby='contained-modal-title-vcenter'
      centered
      animation={false}
      backdrop={true}
      backdropClassName={'allocate-backdrop'}
      size='lg'
    >
      {!showHesitate && (
        <Modal.Header closeButton>Test</Modal.Header>
      )}
      <div style={{display: showHesitate ? 'none' : 'block'}}>
        <div className="asset-table">
          {rows}
        </div>
      </div>
      {showHesitate && <Hesitate onCancel={()=>setShowHesitate(false)} onDiscard={()=>setClose(true)} /> }
    </Modal>
  )
}