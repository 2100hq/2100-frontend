import React, {useState, useMemo} from 'react'

export default function useInputState(start){
  const [state, _setState] = useState(start)
  const setState = useMemo(() => e => {
    const val = e.target ? e.target.value : e
    _setState(val)
  }, [])
  return [state, setState]
}