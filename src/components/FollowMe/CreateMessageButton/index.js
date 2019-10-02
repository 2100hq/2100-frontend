import React, {useState} from 'react'
import {Button} from 'react-bootstrap'
import { useFollowMeContext } from '../../../contexts/FollowMe'
import './style.scss'

export default function CreateMessageButton(props){
  const { actions, showCreate } = useFollowMeContext()
  const show= Boolean(showCreate)
  if (show) return null
  return (
      <div className='compose-button' {...props} onClick={()=>actions.setShowCreate(true)}><i class="fas fa-pen"></i></div>
  )
}