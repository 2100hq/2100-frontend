import React, { useState, useEffect } from 'react'
import VertiallyCenteredModal from '../VerticallyCenteredModal'
import { useStoreContext } from '../../contexts/Store'
function getError (state = {}) {
  const parsed = {}
  parsed.errors = Object.entries(state.error || {})

  parsed.noErrors = parsed.errors.length === 0
  parsed.isErrorCleared = !parsed.noErrors && !parsed.errors[0][1]
  parsed.isMetaMaskError = false

  if (!parsed.noErrors && !parsed.isErrorCleared) {
    parsed.type = parsed.errors[0][0]
    parsed.error = parsed.errors[0][1]
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
    console.log()
    console.log('PARSED', getError(state))

    if (noErrors || isErrorCleared || isMetaMaskError) {
      if (isMetaMaskError) { dispatch(actions.update(['error'], { ...errors, [type]: undefined })) }
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

  const close = () => {
    const { noErrors, isErrorCleared, type, errors } = getError(state)
    if (noErrors || isErrorCleared) return
    dispatch(actions.update(['error'], { ...errors, [type]: undefined }))
  }

  return <VertiallyCenteredModal {...modalProps} onHide={close} />
}
