import React, {useState, useMemo} from 'react'

export default function useInputState(default){
  const [state, _setState] = useState(default)
  const setState = useMemo(() => e => _setState(e.target.value), [])
  return [state, setState]
}