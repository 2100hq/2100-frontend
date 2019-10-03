import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import './style.scss'


export default function ContextBar (props) {
  return (
      <div className='context-bar'>
        <Link to='/'><i style={{fontSize: '1.4rem'}} className="fas fa-arrow-circle-left"></i></Link>
      </div>
  )
}