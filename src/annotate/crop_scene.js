import { PopupDialog } from './popup_dialog.js'

class CropScene extends PopupDialog {
  constructor(ui, editor) {
    super(ui)

    this.ui = ui // wrapper
    this.editor = editor

    this.contentUi = this.ui.querySelector('#content')

    const self = this

    this.ui.querySelector('#btn-generate').onclick = (event) => {
      var xhr = new XMLHttpRequest()
      // we defined the xhr
      xhr.onreadystatechange = function() {
        if (this.readyState != 4) return

        if (this.status == 200) {
          const ret = JSON.parse(this.responseText)
          self.contentUi.querySelector('#log').innerText = JSON.stringify(ret, null, '\t')
        }
      }

      xhr.open('POST', '/dev-ann-api/cropscene', true)

      const para = {
        rawSceneId: this.editor.data.world.frameInfo.scene,
        // id: this.ui.querySelector("#scene-id").value,
        desc: this.ui.querySelector('#scene-desc').value,
        startTime: this.ui.querySelector('#scene-start-time').value,
        seconds: this.ui.querySelector('#scene-seconds').value
      }

      xhr.send(JSON.stringify(para))
    }
  }

  show() {
    const frameInfo = this.editor.data.world.frameInfo
    this.ui.querySelector('#scene-start-time').value = parseInt(frameInfo.frame) - 10
    this.ui.querySelector('#scene-seconds').value = 20
    this.contentUi.querySelector('#log').innerText = ''
    super.show()
  }
}

export {CropScene}