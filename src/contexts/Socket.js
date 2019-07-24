import Socket from 'socket.io-client'

import React, {
  createContext,
  useContext,
  useMemo,
  useState,
  useEffect
} from 'react'
export const SocketContext = createContext()

export function useSocketContext () {
  return useContext(SocketContext)
}

export const SocketContextConsumer = SocketContext.Consumer

const host = process.env.REACT_APP_SOCKET_URL

let io = Socket(host)

function call (path) {
  return (action, ...args) => {
    return new Promise((resolve, reject) => {
      io.emit(path, action, args, (err, result) => {
        if (err) return reject(err)
        resolve(result)
      })
    })
  }
}

function listen (path, cb) {
  return io.on(path, cb)
}
function stop (path) {
  return io.off(path)
}
export default function SocketProvider ({ children }) {
  const [network, setNetwork] = useState({
    loading: true,
    connected: false,
    error: false
  })

  useEffect(() => {
    io.on('connect', () => {
      setNetwork({ loading: false, connected: true, error: false })
    })
    io.on('connect_error', error => {
      setNetwork({ loading: false, connected: false, error: error.message })
    })
    io.on('error', error => {
      setNetwork({ loading: false, connected: false, error: error.message })
    })
    io.on('disconnect', reason => {
      setNetwork({ loading: false, connected: false, error: reason })
      if (reason === 'io server disconnect') {
        io.connect()
      }
    })
  }, [])

  useEffect(() => {
    if (!network.loading) return
    const timeoutId = setTimeout(() => {
      if (network.loading) {
        setNetwork({
          loading: false,
          connected: false,
          error: 'Network failed to load'
        })
      }
    }, 5000)
    return () => clearTimeout(timeoutId)
  }, [network.loading])

  const contextValue = useMemo(() => {
    return { network, call, listen, stop }
  }, [network])

  return (
    <SocketContext.Provider value={contextValue}>
      {children}
    </SocketContext.Provider>
  )
}
