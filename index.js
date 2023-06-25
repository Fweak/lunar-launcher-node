const os = require('process')
const path = require('path')
const fs = require('fs')
const http = require('http')
const child = require('child_process')
const WebSocket = require('ws')

class Socket {
  constructor (port = 7515) {
    this.connected = false
    this.port = port
    this.socket = undefined
  }

  async connectToWebsocket () {
    const data = await this.getDebuggerResponse()
    console.log('[DEVTOOLS] received websocket json data')

    this.socket = new WebSocket(data[0].webSocketDebuggerUrl)
    this.socket.on('open', () => {
      console.log('[DEVTOOLS] connected to the websocket')
      this.connected = true
    })
  }

  getDebuggerResponse () {
    return new Promise((resolve, reject) => {
      http.get(`http://127.0.0.1:${this.port}/json/list`, res => {
        if (res.errored) {
          reject(res.errored)
          return
        }

        res.on('data', chunk => resolve(JSON.parse(chunk.toString())))
        return
      })
    })
  }

  send (method, params) {
    return new Promise(async (resolve, reject) => {
      this.socket.send(JSON.stringify({ id: 1, method, params }), err =>
        err == undefined ? null : reject(err)
      )

      this.socket.once('message', data => resolve(data.toString()))
    })
  }
}

const locateLunarExec = () => {
  if (os.platform == 'win32') {
    if (!fs.existsSync(os.env['localappdata']))
      throw Error('appdata\\local environmental variable does not exist')

    return path.join(
      os.env['localappdata'],
      '\\Programs\\lunarclient\\Lunar Client.exe'
    )
  }

  throw Error('no other platform is supported.')
}

;(async () => {
  let port = 7515
  const socket = new Socket(port)
  const lunarExe = locateLunarExec()
  console.log('[LUNAR] located "./Lunar Client.exe" path')

  child
    .spawn(lunarExe, ['--remote-debugging-port=' + port])
    .on('error', err => console.log('ERROR:', err))
    .on('message', message => console.log('MESSAGE:', message.toString()))
  console.log('[SPAWN] succesfully spawned lunar client process')

  await new Promise(_ => setTimeout(_, 1000)) // delay for the client to boot. idk
  await socket.connectToWebsocket()
  while (!socket.connected) await new Promise(_ => setTimeout(_, 200)) // meow lol git mad scrub

  const contents = fs.readFileSync('payload.js', { encoding: 'utf-8' })
  console.log('[SCRIPT] sending payload to devtools')
  console.log(
    await socket.send('Runtime.evaluate', {
      expression: `${contents}(${JSON.stringify(process.cwd())})`
    })
  )
})()
