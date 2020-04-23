const pc = new window.RTCPeerConnection({})
const { desktopCapturer } = require('electron')

async function getScreenStream() {
  const sources = await desktopCapturer.getSources({ types: ['screen'] })
  return navigator.mediaDevices.getUserMedia({
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
}

pc.onicecandidate = function (e) {
  console.log('candidate, ' + JSON.stringify(e.candidate))
}

let candidates = []
async function addIceCandidate(candidate) {
  if (candidate) {
    candidates.push(candidate)
  }
  if (pc.remoteDescription && pc.remoteDescription.type) {
    for (let i = 0; i < candidates.length; i++) {
      await pc.addIceCandidate(new RTCIceCandidate(candidates[i]))
    }
  }
}

window.addIceCandidate = addIceCandidate

async function createAnswer(offer) {
  let screenStream = await getScreenStream()
  pc.addStream(screenStream)

  await pc.setRemoteDescription(offer)
  await pc.setLocalDescription(await pc.createAnswer())
  console.log('pc answer, ' + JSON.stringify(pc.localDescription))

  return pc.localDescription
}

window.createAnswer = createAnswer
