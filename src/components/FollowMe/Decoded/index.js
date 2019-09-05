import React from 'react'
import ProfileImage from '../../ProfileImage'
import Jazzicon, { jsNumberForAddress } from 'react-jazzicon'
import './style.scss'

export default function Decoded() {
  return(
    <div>
      <hr/>
      <div className='decoded-set'>
        <ProfileImage token='benjmnr'/>
        <ProfileImage token='brttb'/>
        <ProfileImage token='vitalikbuterin'/>
      </div>
      <div className='visibility-info'>
        <div className='decoded-by'>Decoded by $benjmnr, $brttb, $vitalikbuterin and 5 more</div>
        <div className='visible-to'>Visible to 4 other holders of $brttb</div>
      </div>
      <hr/>
    </div>
  )
}
