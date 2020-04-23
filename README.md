# zhost

## notes

```js
import { ipcRenderer } from 'electron'
```

会报错: TypeError: fs.existsSync is not a function

解决办法：

1. 告诉 webpack 不要打包

```js
const { ipcRenderer } = window.require('electron')
```

2. 修改 webpack 配置

```shell
yarn add customize-cra react-app-rewired -D
```

---

package.json 中的 scripts 只能按顺序执行命令，不能等待

concurrently 并行两个命令

wait on 等待完成

---

robotjs c++不能直接引用，需要编译

1. 手动方式

```js
npm rebuild --runtime=electron --disturl=http://atom.io/download/atom-shell --target=<electron version> --abi=<abi version>
// npm rebuild --runtime=electron --disturl=http://atom.io/download/atom-shell --target=8.2.3 --abi=72
```

abi_crosswalk 查找[表](https://github.com/mapbox/node-pre-gyp/blob/master/lib/util/abi_crosswalk.json)

2. 自动化方式

electron-rebuild

---

vkey 键盘键值 CODE 转换为字符

---

vscode 调试

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Debug Main Process",
      "type": "node",
      "request": "launch",
      "cwd": "${workspaceFolder}",
      "runtimeExecutable": "${workspaceFolder}/node_modules/.bin/electron",
      "windows": {
        "runtimeExecutable": "${workspaceFolder}/node_modules/.bin/electron.cmd"
      },
      "args": ["."]
      // "outputCapture": "std"
    }
  ]
}
```

---

websocket.org/echo.html 测试

---

最简单的 P2P

控制端：

- 创建 RTCPeerConnection

- 发起连接 createOffer(得到 offer SDP)

- setLocalDescription(设置 offer SDP)

- 将控制端的 offer SDP 发送给傀儡端

傀儡端：

- 创建 RTCPeerConnection

- 添加桌面流 addstream

- setRemoteDescription(设置控制端 offer SDP)

- 响应连接 createAnswer(得到 answer SDP)

- setLocalDescription(设置 answaer SDP)

- 将傀儡端的 offer SDP 发送给控制端

控制端：

- setRemoteDescription(设置控制端 answer SDP)

---

SDP

Session Description Protocol 会话描述协议

---

NAT

Network Address Translation 网络地址转换

NAT 穿透 打洞

ICE

Interactive Connectivity Establishment 交互式连接创建

优先 STUN

NAT 会话穿越应用程序

备选 TURN

中继 NAT 实现的穿透

---

STUN 过程

控制端 TO STUN：

- 讯问地址 onIceCandidate (返回 IceEvent, 包含 IP+端口)

控制端 TO 傀儡端：

- 将 IceEvent 发送

傀儡端：

- 添加 ICE 代理， addIceCandidate

傀儡端 TO STUN：

- 讯问地址 onIceCandidate (返回 IceEvent, 包含 IP+端口)

傀儡端 TO 控制端 ：

- 将 IceEvent 发送

控制端：

- 添加 ICE 代理， addIceCandidate
