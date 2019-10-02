import React from 'react'

export default function Select({types=[], current=0, onChange=()=>{}, className='', style={}}){
  function handleChange(e){
    e.preventDefault()
    onChange(e.target.value)
  }

  const options = types.map((type,i)=>{
    return <option value={i}>{type}</option>
  })

  return (
    <select className="form-control "+className style={style} value={current} onChange={handleChange}>
      {options}
    </select>
  )
}