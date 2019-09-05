import React, {useState} from 'react'
import {Button} from 'react-bootstrap'
import { useStoreContext } from '../../../contexts/Store'
import CreateMessageModal from '../CreateMessageModal'
import './style.scss'

export default function CreateMessageButton(props){
  const [show, setShow] = useState(false)

  return (
    <>
    <CreateMessageModal show={show} onHide={()=>setShow(false)} />
    <div className='compose-button' {...props} onClick={()=>setShow(true)}><i class="fas fa-pen"></i></div>
    </>
  )
}