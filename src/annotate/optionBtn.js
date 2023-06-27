import { getPathParams, getClickDom } from './getPathParams'
import { POST } from '@/utils/http-client.js'
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
    // leader查看
    if (taskType === '4') {
      document.getElementById('marker-buttons').style.display = 'none'
      document.getElementById('tester-buttons').style.display = 'none'
      document.getElementById('accepter-buttons').style.display = 'none'
    }
  }
}

const OptionButtons = function (data, frameManager) {
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
    const taskType = getPathParams()['taskType']
    if (taskType === '0') {
      const host = document.referrer
      const fromPath = localStorage.getItem('fromPath')
      window.location.href = `${host}#${fromPath}`
    } else {
      window.opener = null
      window.open('', '_self')
      window.close()
    }
  }

  //标注 保存或挂起
  this.ssWork = (type) => {
    if(!this.data.world){
      Message.warning('尚无正在进行的作业，请先开始作业！')
      return false
    }
    buttonLoading = true
    const data = {
      boxCount: this.data?.world?.active ? this.data?.world.annotation.boxes.length : 0,
      homeworkId: this.data.sceneAllData.homework_list.find((f) => f.name === this.data.world.frameInfo.frame)['id'],
      tagTime: '',
      type: type
    }
    this.suspendOrSubmitWork({ ...data })
      .then((res) => {
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
        buttonLoading = false
      })
      .catch(() => {
        buttonLoading = false
      })
  }
  //一检和二检 通过或驳回
  this.tsWork = async (type) => {
    console.log(this.data)
    if(!this.data.world){
      Message.warning('尚无正在进行的作业，请先开始作业！')
      return false
    }
    buttonLoading = true
    // 取出 localStorage 缓存的旧数据
    const oldAnn = JSON.parse(window.localStorage.getItem(this.data.world.frameInfo.frame))
    // 取得 要保存的新数据
    const newAnn = this.data?.world.annotation.toBoxAnnotations()
    // 比较新旧数据获得最终统计数据
    const { deleteCount, insertCount, updateCount } = await diffAnn(oldAnn, newAnn)

    const data = {
      boxCount: this.data?.world?.active ? this.data?.world.annotation.boxes.length : 0,
      homeworkId: this.data.sceneAllData.homework_list.find((f) => f.name === this.data.world.frameInfo.frame)['id'],
      tagTime: '',
      type: type,
      deleteCount: deleteCount,
      insertCount: insertCount,
      updateCount: updateCount,
      tagType: Number(getPathParams()['taskType'])
    }

    this.testWork({ ...data })
      .then((res) => {
        window.localStorage.setItem(this.data.world.frameInfo.frame, JSON.stringify(newAnn))
        if (res.success) {
          if (res.msg === 'T') {
            Message.success('当前作业操作成功！')
            this.markSingleFrameStatus(
              this.getFrameDomByName(this.data.world.frameInfo.frame),
              `${type === 0 ? this.classObj.complete : this.classObj.suspend}`
            )

            // 保存完毕之后，无论成功与否，新数据变旧数据，更新 localStorage 缓存
              window.localStorage.setItem(this.data.world.frameInfo.frame,JSON.stringify(newAnn))

            this.nextWork()
          }
          if (res.msg === 'S') {
            this.optionCompleteMessageBox('已完成所有任务的质检操作，是否返回到任务列表？')
          }
        } else {
          Message.error(res.msg)
        }
        buttonLoading = false
      })
      .catch(() => {
        buttonLoading = false
      })
  }
  //验收 合格或不合格
  this.acptWork = (type) => {
    if(!this.data.world){
      Message.warning('尚无正在进行的作业，请先开始作业！')
      return false
    }
    buttonLoading = true
    const data = {
      homeworkId: this.data.sceneAllData.homework_list.find((f) => f.name === this.data.world.frameInfo.frame)['id'],
      type: type
    }
    this.acceptWork({ ...data })
      .then((res) => {
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
        buttonLoading = false
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
  this.testWork = ({ boxCount, homeworkId, tagTime = '', type, deleteCount, insertCount, updateCount, tagType }) => {
    return POST('/admin/qc/qc-homework', { boxCount, homeworkId, tagTime, type, deleteCount, insertCount, updateCount, tagType })
  }
  // 单张作业验收接口
  this.acceptWork = ({ homeworkId, type }) => {
    return POST('/admin/accept/at-homework', { homeworkId, type, projectId: '', rejectCause: '' })
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

  // 比较新旧两组数据，取出不同框数
  const diffAnn = async (oldList, newList) => {
    let deleteList = [],
      insertList = [],
      updateList = [],
      equalList = []
    // 先排除极端情况，oldList为空，则新增框数 === newList.length，newList为空，则删除框数 === oldList.length
    if (!oldList.length) return { deleteCount: 0, insertCount: newList.length, updateCount: 0 }
    if (!newList.length) return { deleteCount: oldList.length, insertCount: 0, updateCount: 0 }
    // 取出 oldList 中没有的 newList 中有的框
    insertList = newList.filter((item) => oldList.findIndex((w) => w.obj_id === item.obj_id) === -1)
    // 取出 newList 中没有 oldList 中有的框
    deleteList = oldList.filter((item) => newList.findIndex((w) => w.obj_id === item.obj_id) === -1)
    // 取出 oldList 和 NewList 中都有的框
    equalList = oldList.filter((item) => newList.findIndex((w) => w.obj_id === item.obj_id) !== -1).map((x) => x.obj_id)

    if (equalList.length) {
      for (let k = 0; k < equalList.length; k++) {
        // 获取新旧数据中 obj_id 相同的框对象
        const oldOne = oldList.find((o) => Number(o.obj_id) === Number(equalList[k]))
        const newOne = newList.find((n) => Number(n.obj_id) === Number(equalList[k]))
        // 处理 undefined 值
        oldOne.obj_occlu = oldOne.obj_occlu || ''
        oldOne.obj_trunk = oldOne.obj_trunk || ''
        newOne.obj_occlu = newOne.obj_occlu || ''
        newOne.obj_trunk = newOne.obj_trunk || ''

        let isDiff = false // 默认无差异
        // 判断 obj_type 类型
        if (oldOne.obj_type !== newOne.obj_type) isDiff = true
        // 判断 obj_occlu 遮挡
        if (oldOne.obj_occlu !== newOne.obj_occlu) isDiff = true
        // 判断 obj_trunk 截断
        if (oldOne.obj_trunk !== newOne.obj_trunk) isDiff = true
        // 判断 position x y z 有一个不同则跳出循环
        for (const key in oldOne.psr.position) {
          if (oldOne.psr.position[key] !== newOne.psr.position[key]) {
            isDiff = true
            break
          }
        }
        // 判断 rotation x y z 有一个不同则跳出循环
        for (const key in oldOne.psr.rotation) {
          if (oldOne.psr.rotation[key] !== newOne.psr.rotation[key]) {
            isDiff = true
            break
          }
        }
        // 判断 scale x y z 有一个不同则跳出循环
        for (const key in oldOne.psr.scale) {
          if (oldOne.psr.scale[key] !== newOne.psr.scale[key]) {
            isDiff = true
            break
          }
        }
        // 任何参数不同，则加入 updateList
        if (isDiff) {
          updateList.push(equalList[k])
        }
      }
      return { deleteCount: deleteList.length, insertCount: insertList.length, updateCount: updateList.length }
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
