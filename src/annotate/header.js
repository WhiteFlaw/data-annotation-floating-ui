import { saveWorldList } from './save.js'

var Header = function (
  ui,
  data,
  cfg,
  onSceneChanged,
  onFrameChanged,
  onObjectSelected,
  onCameraChanged,
  onAttributeUseChanged,
  onCategoryUseChanged,
  onUsePreviousFrameClicked,
  onFrontCameraClicked,
  onLeftCameraClicked,
  onRightCameraClicked,
  onToggleImageEditor,
  onUndoClicked,
  onRedoClicked
) {
  this.ui = ui
  this.data = data
  this.cfg = cfg

  this.showCameraFront = true;
  this.showCameraLeft = true;
  this.showCameraRight = true;
  this.showImageEditor = true;

  this.boxUi = ui.querySelector('#box')
  this.refObjUi = ui.querySelector('#ref-obj')
  this.sceneSelectorUi = ui.querySelector('#scene-selector')
  this.objectSelectorUi = ui.querySelector('#object-selector')
  this.cameraSelectorUi = ui.querySelector('#camera-selector')
  this.changedMarkUi = ui.querySelector('#changed-mark')
  this.categoryUseUi = ui.querySelector('#if-default-category-use')
  this.attributeUseUi = ui.querySelector('#if-default-attribute-use')
  this.usePreviousFrameUi = ui.querySelector('#use-previous-frame')
  this.cameraFrontImgContainerToggleBtn = ui.querySelector('#camera-front-img-container-toggle');
  this.cameraLeftImgContainerToggleBtn = ui.querySelector('#camera-left-img-container-toggle');
  this.cameraRightImgContainerToggleBtn = ui.querySelector('#camera-right-img-container-toggle');
  this.imageEditorToggleBtn = ui.querySelector('#img-editor-toggle');
  this.undoUi = ui.querySelector('#undo')
  this.redoUi = ui.querySelector('#redo')

  this.onSceneChanged = onSceneChanged
  this.onFrameChanged = onFrameChanged // editor.js--this.frame_changed()
  this.onObjectSelected = onObjectSelected
  this.onCameraChanged = onCameraChanged
  this.onCategoryUseChanged = onCategoryUseChanged
  this.onAttributeUseChanged = onAttributeUseChanged
  this.onUsePreviousFrameClicked = onUsePreviousFrameClicked
  this.onFrontCameraClicked = onFrontCameraClicked
  this.onLeftCameraClicked = onLeftCameraClicked
  this.onRightCameraClicked = onRightCameraClicked
  this.onToggleImageEditor = onToggleImageEditor
  this.onUndoClicked = onUndoClicked
  this.onRedoClicked = onRedoClicked

  if (cfg.disableSceneSelector) {
    this.sceneSelectorUi.style.display = 'none'
  }

  if (cfg.disableCameraSelector) {
    this.cameraSelectorUi.style.display = 'none'
    document.getElementById('camera-selector').parentElement.style.display = 'none'
  }

  // update scene selector ui

  this.updateSceneList = function (sceneDescList) {
    let scene_selector_str = "<option>--scene--</option>";

    if (sceneDescList) scene_selector_str = `<option value="${sceneDescList}">${this.data.sceneAllData.taskName}</option>`;
    this.ui.querySelector('#scene-selector').innerHTML = scene_selector_str
    document.getElementById('scene-selector-name').innerText = this.data.sceneAllData.taskName

  }

  this.updateSceneList(this.data.sceneDescList)
  this.onSceneChanged(this.data.sceneDescList)

  this.ui.querySelector('#btn-reload-scene-list').onclick = (event) => {
    let curentValue = this.sceneSelectorUi.value

    this.data.readSceneList().then((sceneDescList) => {
      this.updateSceneList(sceneDescList)
      this.sceneSelectorUi.value = curentValue
    })
  }

  this.objectSelectorUi.onchange = (e) => {
    this.onObjectSelected(e)
  } // select a ann.

  this.cameraSelectorUi.onchange = (e) => {
    this.onCameraChanged(e)
  } // deprecated.

  this.attributeUseUi.onchange = () => {
    this.onAttributeUseChanged()
  } // enable default attribute

  this.categoryUseUi.onchange = () => {
    this.onCategoryUseChanged()
  } // enable default category

  this.usePreviousFrameUi.onclick = () => {
    this.onUsePreviousFrameClicked()
  } // use previous frame.

  this.cameraFrontImgContainerToggleBtn.onclick = () => {
    this.onFrontCameraClicked(this.showCameraFront)
    if (this.showCameraFront) {
      this.cameraFrontImgContainerToggleBtn.querySelector('span').innerHTML = '显示前相机'
    } else {
      this.cameraFrontImgContainerToggleBtn.querySelector('span').innerHTML = '隐藏前相机'
    }
    this.showCameraFront = !this.showCameraFront;
  } // show/hide front camera.

  this.cameraLeftImgContainerToggleBtn.onclick = () => {
    this.onLeftCameraClicked(this.showCameraLeft)
    if (this.showCameraLeft) {
      this.cameraLeftImgContainerToggleBtn.querySelector('span').innerHTML = '显示左相机'
    } else {
      this.cameraLeftImgContainerToggleBtn.querySelector('span').innerHTML = '隐藏左相机'
    }
    this.showCameraLeft = !this.showCameraLeft;
  } // show/hide left camera.

  this.cameraRightImgContainerToggleBtn.onclick = () => {
    this.onRightCameraClicked(this.showCameraRight)
    if (this.showCameraRight) {
      this.cameraRightImgContainerToggleBtn.querySelector('span').innerHTML = '显示右相机'
    } else {
      this.cameraRightImgContainerToggleBtn.querySelector('span').innerHTML = '隐藏右相机'
    }
    this.showCameraRight = !this.showCameraRight;
  } // show/hide right camera.

  this.imageEditorToggleBtn.onclick = () => {
    this.onToggleImageEditor(this.showImageEditor);
    if (this.showImageEditor) {
      this.imageEditorToggleBtn.querySelector('span').innerHTML = '显示编辑器'
    } else {
      this.imageEditorToggleBtn.querySelector('span').innerHTML = '隐藏编辑器'
    }
    this.showImageEditor = !this.showImageEditor;
  } // show/hide right camera.

  this.undoUi.onclick = () => {
    this.onUndoClicked()
  } // undo

  this.redoUi.onclick = () => {
    this.onRedoClicked()
  } // redo

  this.setObject = function (id) {
    this.objectSelectorUi.value = id
  }

    /* this.clear_box_info = function () {
          this.boxUi.innerHTML = '';
      }; */

    ; (this.update_box_info = function (box) {
      var scale = box.scale
      /* var pos = box.position;
          var rotation = box.rotation;
          var points_number = box.world.lidar.get_box_points_number(box);
          let distance = Math.sqrt(pos.x * pos.x + pos.y * pos.y).toFixed(2);

          this.boxUi.innerHTML = "<span>" + box.obj_type + "-" + box.obj_track_id +
          (box.annotator ? ("</span> | <span title='annotator'>" + box.annotator) : "") +
          "</span> | <span title='distance'>" + distance +
          "</span> | <span title='position'>" + pos.x.toFixed(2) + " " + pos.y.toFixed(2) + " " + pos.z.toFixed(2) +
          "</span> | <span title='scale'>" + scale.x.toFixed(2) + " " + scale.y.toFixed(2) + " " + scale.z.toFixed(2) +
          "</span> | <span title='rotation'>" +
          (rotation.x * 180 / Math.PI).toFixed(2) + " " + (rotation.y * 180 / Math.PI).toFixed(2) + " " + (rotation.z * 180 / Math.PI).toFixed(2) +
          "</span> | <span title = 'points'>" +
          points_number + "</span> "; */
      document.getElementById('sub-views-size-top-val').innerHTML = `宽：${scale.y.toFixed(2)} 长：${scale.x.toFixed(2)}`
      document.getElementById('sub-views-size-left-val').innerHTML = `长：${scale.x.toFixed(2)} 高：${scale.z.toFixed(2)}`
      document.getElementById('sub-views-size-front-val').innerHTML = `宽：${scale.y.toFixed(2)} 高：${scale.z.toFixed(2)}`
      if (box.follows) {
        this.boxUi.innerHTML += '| F:' + box.follows.obj_track_id
      }
    }),
      /* this.set_ref_obj = function (marked_object) {
          this.refObjUi.innerHTML = "| Ref: " + marked_object.scene + "/" + marked_object.frame + ": " + marked_object.ann.obj_type + "-" + marked_object.ann.obj_id;
      }, */

      (this.updateModifiedStatus = function () {
        let frames = this.data.worldList.filter((w) => w.annotation.modified)
        if (frames.length > 0) {
          this.changedMarkUi.className = 'ui-button alarm-mark'
        } else {
          this.changedMarkUi.className = 'ui-button'
        }
      })

  this.updateSaveFeedback = function () {
    const feedback = this.ui.querySelector('#save-feedback')
    feedback.style.display = 'block'
    setTimeout(() => (feedback.style.display = 'none'), 2000)
  }

  this.changedMarkUi.onmouseenter = () => {
    let items = ''
    this.ui.querySelector('#changed-world-list-wrapper').style.display = 'inherit'
    let frames = this.data.worldList.filter((w) => w.annotation.modified).map((w) => w.frameInfo)
    frames.forEach((f) => {
      items += "<div class='modified-world-item'>" + f.frame + '</div>'
    })

    if(frames.length === 0) {
      this.ui.querySelector('#changed-world-list').innerHTML = '无';
      return;
    }
    this.ui.querySelector('#changed-world-list').innerHTML = items;
  }

  this.changedMarkUi.onmouseleave = () => {
    this.ui.querySelector('#changed-world-list-wrapper').style.display = 'none'
  }

  this.ui.querySelector('#save-button').onclick = () => {
    saveWorldList(this.data.worldList, true)
  }
}

export { Header }
