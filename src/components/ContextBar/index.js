import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import './style.scss'


export default function ContextBar (props) {
  return (
      <div className='context-bar'>
        <Link to='/'><i style={{fontSize: '1rem'}} className="fas fa-chevron-left"></i></Link>
      </div>
  )
}