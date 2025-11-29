'use client'

import { io, Socket } from 'socket.io-client'

let socket: Socket | null = null

export const getSocket = (): Socket => {
  if (!socket) {
    socket = io(undefined, {
      autoConnect: false,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      timeout: 20000
    })
  }
  return socket
}

export const connectSocket = (): Socket => {
  const s = getSocket()
  if (!s.connected) {
    s.connect()
  }
  return s
}

export const disconnectSocket = (): void => {
  if (socket?.connected) {
    socket.disconnect()
  }
}
