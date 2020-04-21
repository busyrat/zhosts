const EventEmitter = require('events')
const peer = new EventEmitter()

const { desktopCapturer } = require('electron')

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

module.exports = peer
