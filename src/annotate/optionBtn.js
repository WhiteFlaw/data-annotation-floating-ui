import { getPathParams, getClickDom } from './getPathParams'
import { POST } from '@/utils/http-client.js'
// import { saveWorldList } from "./save.js"
import { objIdManager } from './obj_id_list.js'
import { Message, MessageBox } from 'element-ui'

const initOptionBtn = () => {
  const taskType = getPathParams()['taskType']
  if (taskType) {
    // 从标注跳转
    if (taskType === '0') {
      document.getElementById('marker-buttons').style.display = 'flex'
      document.getElementById('tester-buttons').style.display = 'none'
      document.getElementById('accepter-buttons').style.display = 'none'
    }
    // 从一检或二检跳转
    if (taskType === '1' || taskType === '2') {
      document.getElementById('marker-buttons').style.display = 'none'
      document.getElementById('tester-buttons').style.display = 'flex'
      document.getElementById('accepter-buttons').style.display = 'none'
    }
    // 从验收跳转
    if (taskType === '3') {
      document.getElementById('marker-buttons').style.display = 'none'
      document.getElementById('tester-buttons').style.display = 'none'
      document.getElementById('accepter-buttons').style.display = 'flex'
    }
  }
}

const OptionButtons = function (data, frameManager) {
  // this.boxCount = boxCount
  // this.homeworkId = homeworkId
  // this.tagTime = tagTime
  // this.ssType = ssType // 提交 0 / 挂起 1
  // this.rpType = rpType // 通过 0 / 驳回 1
  // this.qfType = qfType // 合格 0 / 不合格 1
  this.boxCount = 0
  this.data = data
  this.exitButton = document.getElementById('exit-button')
  this.fnSuspendButton = document.getElementById('fn-suspend-button')
  this.fnSubmitButton = document.getElementById('fn-submit-button')
  this.fnRejectButton = document.getElementById('fn-reject-button')
  this.fnPassButton = document.getElementById('fn-pass-button')
  this.fnQfbutton = document.getElementById('fn-qf-button')
  this.fnDisqfButton = document.getElementById('fn-disqf-button')
  this.fnResumeButton = document.getElementById('fn-resume-button')

  this.cameraImgContainerToggleBtn = document.getElementById('camera-img-container-toggle')
  this.qcCommentContainerToggleBtn = document.getElementById('qc-comment-container-toggle')

  this.classObj = {
    complete: 'frame-complete',
    suspend: 'frame-suspend',
    reject: 'frame-reject'
  }

  let buttonLoading = false

  this.exitButton.onclick = () => {
    this.exitTask()
  }

  this.fnSuspendButton.onclick = () => {
    if (!buttonLoading) this.ssWork(1)
  }

  this.fnSubmitButton.onclick = () => {
    if (!buttonLoading) this.ssWork(0)
  }

  this.fnRejectButton.onclick = () => {
    if (!buttonLoading) this.tsWork(1)
  }

  this.fnPassButton.onclick = () => {
    if (!buttonLoading) this.tsWork(0)
  }

  this.fnQfbutton.onclick = () => {
    if (!buttonLoading) this.acptWork(0)
  }

  this.fnDisqfButton.onclick = () => {
    if (!buttonLoading) this.acptWork(1)
  }

  this.exitTask = () => {
    const host = document.referrer
    const fromPath = localStorage.getItem('fromPath')
    window.location.href = `${host}#${fromPath}`
  }

  //标注 保存或挂起
  this.ssWork = (type) => {
    let scene = this.data.world.frameInfo.scene
    buttonLoading = true
    objIdManager.load_obj_ids_of_scene(scene, (objs) => {
      const data = {
        boxCount: objs.reduce((a, b) => a + b.count, 0),
        homeworkId: this.data.sceneAllData.homework_list.find((f) => f.name === this.data.world.frameInfo.frame)['id'],
        tagTime: '',
        type: type
      }
      this.suspendOrSubmitWork({ ...data })
        .then((res) => {
          buttonLoading = false
          if (res.success) {
            if (res.msg === 'T') {
              Message.success('当前作业操作成功！')
              this.markSingleFrameStatus(
                this.getFrameDomByName(this.data.world.frameInfo.frame),
                `${type === 0 ? this.classObj.complete : this.classObj.suspend}`
              )
              this.nextWork()
            }
            if (res.msg === 'C') {
              this.optionCompleteMessageBox('已完成所有任务的标注操作，是否返回到任务列表？')
            }
          } else {
            Message.error(res.msg)
          }
        })
        .catch(() => {
          buttonLoading = false
        })
    })
  }
  //一检和二检 通过或驳回
  this.tsWork = (type) => {
    // const data = {
    //   homeworkId: this.data.sceneAllData.homework_list.find((f) => f.name === this.data.world.frameInfo.frame)['id'],
    //   type: type
    // }
    let scene = this.data.world.frameInfo.scene
    buttonLoading = true
    objIdManager.load_obj_ids_of_scene(scene, (objs) => {
      const data = {
        boxCount: objs.reduce((a, b) => a + b.count, 0),
        homeworkId: this.data.sceneAllData.homework_list.find((f) => f.name === this.data.world.frameInfo.frame)['id'],
        tagTime: '',
        type: type
      }
    this.testWork({ ...data })
      .then((res) => {
        buttonLoading = false
        if (res.success) {
          if (res.msg === 'T') {
            Message.success('当前作业操作成功！')
            this.markSingleFrameStatus(
              this.getFrameDomByName(this.data.world.frameInfo.frame),
              `${type === 0 ? this.classObj.complete : this.classObj.suspend}`
            )
            this.nextWork()
          }
          if (res.msg === 'S') {
            this.optionCompleteMessageBox('已完成所有任务的质检操作，是否返回到任务列表？')
          }
        } else {
          Message.error(res.msg)
        }
      })
      .catch(() => {
        buttonLoading = false
      })
    })
  }
  //验收 合格或不合格
  this.acptWork = (type) => {
    const data = {
      homeworkId: this.data.sceneAllData.homework_list.find((f) => f.name === this.data.world.frameInfo.frame)['id'],
      type: type
    }
    buttonLoading = true
    this.acceptWork({ ...data })
      .then((res) => {
        buttonLoading = false
        if (res.success) {
          if (res.msg === 'T') {
            Message.success('当前作业操作成功！')
            this.markSingleFrameStatus(
              this.getFrameDomByName(this.data.world.frameInfo.frame),
              `${type === 0 ? this.classObj.complete : this.classObj.suspend}`
            )
            this.nextWork()
          }
          if (res.msg === 'S') {
            this.optionCompleteMessageBox('已完成所有任务的验收操作，是否返回到任务列表？')
          }
        } else {
          Message.error(res.msg)
        }
      })
      .catch(() => {
        buttonLoading = false
      })
  }
  // 操作完成提示框
  this.optionCompleteMessageBox = (msg) => {
    MessageBox.confirm(msg, '操作确认', {
      distinguishCancelAndClose: true,
      confirmButtonText: '确定',
      cancelButtonText: '取消'
      // callback:() => {
      //   this.exitTask()
      // }
    })
      .then(() => {
        this.exitTask()
      })
      .catch(() => {
        Message.info('操作取消！')
      })
  }
  // 单个操作完成跳转下一个
  this.nextWork = () => {
    frameManager.toNextFrame()
    frameManager.after_next()
  }
  // 单个作业的提交与挂起
  this.suspendOrSubmitWork = ({ boxCount, homeworkId, tagTime = '', type }) => {
    return POST('/admin/tagging/tag-homework', { boxCount, homeworkId, tagTime, type })
  }
  // 单张作业质检接口
  this.testWork = ({ homeworkId, type }) => {
    return POST(`/admin/qc/qc-homework/${homeworkId}/${type}`)
  }
  // 单张作业验收接口
  this.acceptWork = ({ homeworkId, type }) => {
    return POST('/admin/accept/at-homework', { homeworkId, type, projectId: '', rejectCause: '' })
  }
  // header工具栏：显示/隐藏相机视图按钮
  this.cameraImgContainerToggleBtn.onclick = (e) => {
    if (this.cameraImgContainerToggleBtn.getElementsByTagName('span')[0].innerText === '显示相机') {
      document.getElementById('image-manager-wrapper').style.display = 'block'
      this.cameraImgContainerToggleBtn.getElementsByTagName('span')[0].innerText = '隐藏相机'
      return false
    }
    if (this.cameraImgContainerToggleBtn.getElementsByTagName('span')[0].innerText === '隐藏相机') {
      document.getElementById('image-manager-wrapper').style.display = 'none'
      this.cameraImgContainerToggleBtn.getElementsByTagName('span')[0].innerText = '显示相机'
      return false
    }
  }
  // header工具栏：显示/隐藏质检批注按钮
  this.qcCommentContainerToggleBtn.onclick = (e) => {
    if (this.qcCommentContainerToggleBtn.getElementsByTagName('span')[0].innerText === '显示批注') {
      document.getElementById('comment-manager-wrapper').style.display = 'block'
      this.qcCommentContainerToggleBtn.getElementsByTagName('span')[0].innerText = '隐藏批注'
      return false
    }
    if (this.qcCommentContainerToggleBtn.getElementsByTagName('span')[0].innerText === '隐藏批注') {
      document.getElementById('comment-manager-wrapper').style.display = 'none'
      this.qcCommentContainerToggleBtn.getElementsByTagName('span')[0].innerText = '显示批注'
      return false
    }
  }

  // 以下处理frameList状态颜色

  this.getFrameDomByName = function (name) {
    const frameList = document.getElementsByClassName('frame-list-div')
    let selectedDom = null
    for (let i = 0; i < frameList.length; i++) {
      if (frameList[i].attributes.value.value === name) {
        selectedDom = frameList[i]
        break
      }
    }
    return selectedDom
  }

  this.markSingleFrameStatus = function (frame, className) {
    for (let i = 0; i < frame.classList.length; i++) {
      if (frame.classList[i] !== 'frame-list-div') {
        frame.classList.remove(frame.classList[i])
      }
    }
    frame.classList.add(className)
  }

  this.markFrameStatus = function (listItems = null) {
    const taskType = getPathParams()['taskType']
    const frameList = this.data.sceneAllData.homework_list
    frameList.forEach((f, i) => {
      // 获取frame对象的属性
      const frameKeys = Object.keys(f)
      // 标注进来
      if (
        taskType === '0' &&
        ((!frameKeys.includes('checkStatus') && !frameKeys.includes('recheckStatus')) ||
          (frameKeys.includes('checkStatus') && f.checkStatus && frameKeys.includes('recheckStatus') && f.recheckStatus))
      ) {
        // 已挂起
        if (Number(f.status) === 2) {
          this.markSingleFrameStatus(listItems[i], this.classObj.suspend)
        }
        // 已完成
        if (Number(f.status) === 3) {
          this.markSingleFrameStatus(listItems[i], this.classObj.complete)
        }
      } else if (taskType === '0' && ((frameKeys.includes('checkStatus') && !f.checkStatus) || (frameKeys.includes('recheckStatus') && !f.recheckStatus))) {
        this.markSingleFrameStatus(listItems[i], this.classObj.reject)
      }
      // 一检进来
      if (taskType === '1' && !frameKeys.includes('rejectStatus')) {
        if (frameKeys.includes('checkStatus') && !f.checkStatus) {
          this.markSingleFrameStatus(listItems[i], this.classObj.suspend)
        } else if (frameKeys.includes('checkStatus') && f.checkStatus) {
          this.markSingleFrameStatus(listItems[i], this.classObj.complete)
        }
      } else if (taskType === '1' && frameKeys.includes('rejectStatus') && f.rejectStatus) {
        this.markSingleFrameStatus(listItems[i], this.classObj.reject)
      }
      // 二检进来
      if (taskType === '2') {
        if (frameKeys.includes('recheckStatus') && !f.recheckStatus) {
          this.markSingleFrameStatus(listItems[i], this.classObj.suspend)
        } else if (frameKeys.includes('recheckStatus') && f.recheckStatus) {
          this.markSingleFrameStatus(listItems[i], this.classObj.complete)
        }
      }
      // 验收进来
      if (taskType === '3') {
        if (frameKeys.includes('rejectStatus') && !f.rejectStatus) {
          this.markSingleFrameStatus(listItems[i], this.classObj.suspend)
        } else if (frameKeys.includes('rejectStatus') && f.rejectStatus) {
          this.markSingleFrameStatus(listItems[i], this.classObj.complete)
        }
      }
    })
  }
  getClickDom(this.markFrameStatus.bind(this))
}

export { initOptionBtn, OptionButtons }
