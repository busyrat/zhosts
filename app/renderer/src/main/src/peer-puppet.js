const pc = new window.RTCPeerConnection({})
const { desktopCapturer, ipcRenderer } = require('electron')

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
  if (e.candidate) {
    ipcRenderer.send('forward', 'puppet-candidate', JSON.stringify(e.candidate))
  }
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

ipcRenderer.on('offer', async (e, offer) => {
  let answer = await createAnswer(offer)
  ipcRenderer.send('forward', 'answer', { type: answer.type, sdp: answer.sdp })
})

async function createAnswer(offer) {
  let screenStream = await getScreenStream()
  pc.addStream(screenStream)

  await pc.setRemoteDescription(offer)
  await pc.setLocalDescription(await pc.createAnswer())
  // console.log('pc answer, ' + JSON.stringify(pc.localDescription))

  return pc.localDescription
}

window.createAnswer = createAnswer
