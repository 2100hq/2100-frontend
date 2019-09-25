import React, {useState, useMemo} from 'react'

export default function clickHandler(fn=()=>{}, args,{preventDefault=true, stopPropagation=true}={}){
  const cb = e => {
    if (e && e.preventDefault && preventDefault) e.preventDefault()
    if (e && e.stopPropagation && stopPropagation) e.stopPropagation()
    if (!args) return fn()
    if (typeof args === 'function') return fn(args())
    if (Array.isArray(args)) return fn(...args)
    return fn(args)
  }
  return cb
}