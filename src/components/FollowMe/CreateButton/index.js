import React, {useState} from 'react'
import {Button} from 'react-bootstrap'
import { useStoreContext } from '../../../contexts/Store'
import CreateModal from '../CreateModal'
export default function CreateButton(props){
  const [show, setShow] = useState(false)

  return (
    <>
    <CreateModal show={show} onHide={()=>setShow(false)} />
    <Button {...props} onClick={()=>setShow(true)}>Create</Button>
    </>
  )
}