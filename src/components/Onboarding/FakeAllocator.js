import React, { useState, useEffect } from 'react'
import Dots from '../Dots'

export default function FakeAllocator({defaultCurrent=5}){
  const [current, setCurrent] = useState(defaultCurrent)
  return <Dots total={10} current={current} onClick={ setCurrent } />
}