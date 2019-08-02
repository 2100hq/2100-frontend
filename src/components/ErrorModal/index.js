import React, { useState, useEffect } from 'react'
import VertiallyCenteredModal from '../VerticallyCenteredModal'
import { useStoreContext } from '../../contexts/Store'
function getError (state = {}) {
  const parsed = {}
  const errors = Object.entries(state.error || {})

  parsed.noErrors = errors.length === 0
  parsed.isErrorCleared = !parsed.noErrors && !errors[0][1]
  parsed.isMetaMaskError = false

  if (!parsed.noErrors && !parsed.isErrorCleared) {
    parsed.type = errors[0][0]
    parsed.error = errors[0][1]
    parsed.message = parsed.error.message || parsed.error
    parsed.isMetaMaskError = /metamask/i.test(parsed.message)
  }

  return parsed
}

export default function ErrorModal () {
  const { dispatch, state, actions } = useStoreContext()
  const [modalProps, setModalProps] = useState({ show: false })
  useEffect(() => {
    const {
      noErrors,
      isErrorCleared,
      isMetaMaskError,
      message,
      type,
      errors
    } = getError(state)

    if (noErrors || isErrorCleared || isMetaMaskError) {
      if (isMetaMaskError) {
        dispatch(
          actions.update(['error'], { ...state.error, [type]: undefined })
        )
      }
      if (!modalProps.show) return
      return setModalProps({
        show: false
      })
    }

    setModalProps({
      show: true,
      body: message
    })
  }, [state.error])

  const clearError = () => {
    const { noErrors, isErrorCleared, type, errors } = getError(state)
    if (noErrors || isErrorCleared) return
    dispatch(actions.update(['error'], { ...state.error, [type]: undefined }))
  }

  return <VertiallyCenteredModal {...modalProps} onHide={clearError} />
}
