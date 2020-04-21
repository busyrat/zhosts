const EventEmitter = require('events')
const peer = new EventEmitter()

const { desktopCapturer, ipcRenderer } = require('electron')

async function getScreenStream(params) {
  const sources = await desktopCapturer.getSources({ types: ['screen'] })
  navigator.mediaDevices
    .getUserMedia({
      audio: false,
      video: {
        mandatory: {
          chromeMediaSource: 'desktop',
          chromeMediaSourceId: sources[0].id,
          maxWidth: window.screen.width,
          maxHeight: window.screen.height,
        },
      },
    })
    .then((stream) => {
      peer.emit('add-stream', stream)
    })
}

getScreenStream()

peer.on('robot', (type, data) => {
  if (type === 'mouse') {
    data.screen = { width: window.screen.width, height: window.screen.height }
  }
  ipcRenderer.send('robot', type, data)
})

module.exports = peer
