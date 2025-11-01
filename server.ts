/**
 * Custom server for Next.js with Socket.io for real-time features.
 *
 * @remarks
 * Provides automatic port conflict resolution - if the default port (3000) is in use,
 * it will try 3001, 3002, etc. up to 10 attempts.
 *
 * @module server
 * @category API
 * @public
 */

import { createServer } from 'node:http'
import next from 'next'
import { Server } from 'socket.io'
import { NowPlayingService } from './lib/now-playing-server'

const dev = process.env.NODE_ENV !== 'production'
const hostname = dev ? 'localhost' : process.env.HOSTNAME || '0.0.0.0'
const initialPort = parseInt(process.env.PORT || '3000', 10)
const maxPortAttempts = 10

const app = next({ dev, hostname })
const handler = app.getRequestHandler()

/**
 * Starts the server on the specified port, retrying with port+1 if already in use.
 *
 * @param port - Port number to attempt
 * @param attempt - Current attempt number (max 10)
 *
 * @remarks
 * Handles `EADDRINUSE` errors by recursively trying the next port.
 * Exits process if max attempts exceeded or on other errors.
 *
 * @public
 */
function startServer(port: number, attempt: number = 0): void {
  if (attempt >= maxPortAttempts) {
    console.error(
      `✗ Failed to find an available port after ${maxPortAttempts} attempts (tried ports ${initialPort}-${port - 1})`
    )
    process.exit(1)
  }

  const httpServer = createServer(handler)

  if (dev) {
    const upgradeHandler = app.getUpgradeHandler()
    httpServer.on('upgrade', (req, socket, head) => {
      const { pathname } = new URL(req.url || '/', `http://${hostname}`)

      if (pathname === '/_next/webpack-hmr') {
        upgradeHandler(req, socket, head).catch((err) => {
          socket.destroy()
          console.error('✗ Upgrade handler error:', err)
        })
      }
    })
  }

  const io = new Server(httpServer, {
    cors: {
      origin: dev
        ? ['http://localhost:3000', 'http://localhost:3001']
        : process.env.CORS_ORIGIN || '*',
      methods: ['GET', 'POST'],
      credentials: true
    },
    maxHttpBufferSize: 1e6, // 1MB
    pingTimeout: 60000, // 60s
    pingInterval: 25000, // 25s
    transports: ['websocket', 'polling'],
    allowEIO3: true,
    connectTimeout: 45000
  })

  const refreshIntervals = new Map<string, NodeJS.Timeout>()
  const rateLimitMap = new Map<string, { count: number; resetTime: number }>()

  const nowPlayingService = new NowPlayingService(io)

  // Rate limiting helper (10 requests per minute per socket)
  const checkRateLimit = (socketId: string): boolean => {
    const now = Date.now()
    const limit = rateLimitMap.get(socketId)

    if (!limit || now > limit.resetTime) {
      rateLimitMap.set(socketId, { count: 1, resetTime: now + 60000 })
      return true
    }

    if (limit.count >= 10) {
      return false
    }

    limit.count++
    return true
  }

  io.on('connection', (socket) => {
    console.log('[WS] Client connected:', socket.id)

    const stopAutoRefresh = () => {
      const existingInterval = refreshIntervals.get(socket.id)
      if (existingInterval) {
        clearInterval(existingInterval)
        refreshIntervals.delete(socket.id)
      }
    }

    socket.on('requestNowPlaying', async () => {
      if (!checkRateLimit(socket.id)) {
        socket.emit('nowPlaying', {
          status: 'error',
          message: 'Rate limit exceeded. Please wait before requesting again.'
        })
        return
      }

      await nowPlayingService.fetchNowPlaying(socket.id)
    })

    socket.on('startAutoRefresh', () => {
      stopAutoRefresh()

      const intervalId = setInterval(async () => {
        await nowPlayingService.fetchNowPlaying(socket.id)
      }, 30000)

      refreshIntervals.set(socket.id, intervalId)
    })

    socket.once('disconnect', () => {
      stopAutoRefresh()
      rateLimitMap.delete(socket.id)
      console.log('[WS] Client disconnected:', socket.id)
    })
  })

  httpServer.on('error', (err: NodeJS.ErrnoException) => {
    if (err.code === 'EADDRINUSE') {
      console.log(`⚠ Port ${port} is already in use, trying ${port + 1}...`)
      httpServer.close()
      startServer(port + 1, attempt + 1)
    } else {
      console.error('✗ Server error:', err)
      process.exit(1)
    }
  })

  httpServer.listen(port, () => {
    if (port !== initialPort) {
      console.log(
        `✓ Ready on http://${hostname}:${port} (port ${initialPort} in use)`
      )
    } else {
      console.log(`✓ Ready on http://${hostname}:${port}`)
    }
  })
}

app.prepare().then(() => {
  startServer(initialPort)
})
