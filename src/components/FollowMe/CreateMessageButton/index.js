import React, {useState} from 'react'
import {Button} from 'react-bootstrap'
import { useStoreContext } from '../../../contexts/Store'
import CreateMessageModal from '../CreateMessageModal'
export default function CreateMessageButton(props){
  const [show, setShow] = useState(false)

  return (
    <>
    <CreateMessageModal show={show} onHide={()=>setShow(false)} />
    <Button {...props} onClick={()=>setShow(true)}>Create</Button>
    </>
  )
}