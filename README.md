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
