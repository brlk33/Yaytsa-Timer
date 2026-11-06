const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('alertApi', {
  act: (action) => ipcRenderer.send('alert:action', action),
});
