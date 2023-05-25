import axios from 'axios'
import { GET, POST } from '@/utils/http-client.js'
import { Message } from 'element-ui'
import { innerDOMString } from './util.js'
import { commentManagerTemplate } from './template/commentManagerTemplate.js'
import { getPathParams } from './getPathParams.js'

export const CommentManager = function (parentUi, data, onCommentChanged, onCommentSubmitted) {
  innerDOMString(commentManagerTemplate, parentUi)
  this.ui = parentUi.querySelector('#comment-manager-wrapper')
  this.addCommentBtn = this.ui.querySelector('#comment-add-btn')
  this.commentListUl = document.getElementById('comment-list-items')
  this.commentAddDialog = document.getElementById('comment-add-dialog')
  this.commentAddFormCommon = document.getElementById('comment-add-form-common')
  this.commentAddFormSingle = document.getElementById('comment-add-form-single')
  this.commentAddDialogClose = document.getElementById('comment-add-dialog-close')
  this.commonCommentRadio = document.getElementById('common-comment-radio')
  this.singleItemCommentRadio = document.getElementById('single-item-comment-radio')
  this.commentAddSubmitBtnNew = document.getElementById('comment-add-submit-btn-new')
  this.commentAddSubmitBtnClose = document.getElementById('comment-add-submit-btn-close')
  this.commentAddCancelBtn = document.getElementById('comment-add-cancel-btn')

  this.selectedType = '0'
  this.objectsList = []
  this.data = data
  this.taskId = getPathParams()['taskId'] || 0
  this.taskName = ''
  this.worldList = []
  this.commentsList = []
  this.commentObj = {}
  this.taskType = getPathParams()['taskType'] || '0'
  if (this.taskType === '0') this.addCommentBtn.style.display = 'none'

  this.updatedCommentLists = async function (world) {
    this.worldList = world.data.worldList

    if (!this.taskName || this.taskName !== world.sceneMeta.scene) {
      this.taskName = world.sceneMeta.scene
      if (!this.objectsList.length) {
        const resObj = await this.getObjectsList(this.taskName)
        if (resObj.status === 200) {
          this.objectsList = [...resObj.data]
        } else {
          Message.error(resObj.statusText)
        }
      }
      this.renderCommentsList(this.taskId)
    }
  }

  this.renderCommentsList = function (taskId) {
    const self = this
    this.getCommentsList(taskId).then((res) => {
      if (res.success) {
        this.commentsList = [...res.data]
        if (!res.data.length) return false
        let commentLi = res.data
          .map(function (c) {
            if (self.taskType === '0') {
              return `<li><span>${self.findObject(self.objectsList, c.objId)}</span><span>${c.info}</span><span id="view-object-${c.id}">查看</span></li>`
            } else {
              return `<li><span>${self.findObject(self.objectsList, c.objId)}</span><span>${c.info}</span><span id="edit-object-${c.id}">修改</span></li>`
            }
          })
          .reduce(function (x, y) {
            return x + y
          })
        this.commentListUl.innerHTML = commentLi
      } else {
        Message.error(res.msg)
      }
    })
  }

  this.addCommentListItem = function (event) {
    if(!this.objectsList.length){
      Message.error('任务尚未开始，不能进行批注！')
      return false
    }
    this.commentAddDialog.style.display = 'block'

    this.commentAddDialog.addEventListener("keydown",e=>e.stopPropagation())
  }

  this.editCommentListItem = function (event) {
    if (event.target.innerText !== '修改' && event.target.innerText !== '查看') return
    const id = event.target.getAttribute('id').split('-')[2]
    this.commentObj = this.commentsList.find((item) => Number(item.id) === Number(id))
    this.commentAddDialog.style.display = 'block'
    this.selectedType = String(this.commentObj.type) || '0'
    if (this.selectedType === '0') {
      this.commentAddFormCommon.style.display = 'flex'
      this.commentAddFormSingle.style.display = 'none'
      this.commentAddFormCommon.querySelector('#comment-add-text-common').value = this.commentObj.info
    }
    if (this.selectedType === '1') {
      this.commentAddFormSingle.style.display = 'flex'
      this.commentAddFormCommon.style.display = 'none'
      this.commentAddFormSingle.querySelector('#object-list').value = this.commentObj.objId
      this.commentAddFormSingle.querySelector('#comment-add-text-single').value = this.commentObj.info
    }

    if (event.target.innerText === '查看') {
      if (this.selectedType === '1') {
        this.commonCommentRadio.parentElement.style.display = 'none'
        this.commentAddFormSingle.querySelector('#object-list').setAttribute('disabled','')
        this.commentAddFormSingle.querySelector('#comment-add-text-single').setAttribute('readonly', '')
      }
      if (this.selectedType === '0') {
        this.singleItemCommentRadio.parentElement.style.display = 'none'
        this.commentAddFormCommon.querySelector('#comment-add-text-common').setAttribute('readonly', '')
      }
      this.commentAddSubmitBtnNew.style.display = 'none'
      this.commentAddSubmitBtnClose.style.display = 'none'
    }
  }

  this.closeCommentAddDialog = function (event) {
    this.resetCommentAddForm()
    this.commentAddFormCommon.style.display = 'flex'
    this.commentAddFormSingle.style.display = 'none'
    this.commonCommentRadio.checked = true
    this.singleItemCommentRadio.checked = false
    this.commentAddDialog.style.display = 'none'
  }

  this.resetCommentAddForm = function (event) {
    this.commentAddFormCommon.querySelector('#comment-add-text-common').value = ''
    this.commentAddFormSingle.querySelector('#object-list').value = ''
    this.commentAddFormSingle.querySelector('#comment-add-text-single').value = ''
  }

  this.radioClick = function (event) {
    this.selectedType = event.target.value
    if (event.target.value === '0') {
      this.commentAddFormCommon.style.display = 'flex'
      this.commentAddFormSingle.style.display = 'none'
    }
    if (event.target.value === '1') {
      this.commentAddFormSingle.style.display = 'flex'
      this.commentAddFormCommon.style.display = 'none'
    }
  }

  this.addCommentSubmit = function (event) {
    const btnId = event.target.getAttribute('id')
    // console.log('保存', btnId)
    const comment = {
      type: this.selectedType,
      objId: '',
      info: '',
      id: this.commentObj.id || ''
    }
    if (this.selectedType === '0') {
      comment.info = this.commentAddFormCommon.querySelector('#comment-add-text-common').value
    }
    if (this.selectedType === '1') {
      comment.objId = this.commentAddFormSingle.querySelector('#object-list').value
      comment.info = this.commentAddFormSingle.querySelector('#comment-add-text-single').value
    }

    this.postCommentsList(this.taskId, comment).then((res) => {
      if (res.success) {
        Message.success(res.msg)
        this.renderCommentsList(this.taskId)
        if (btnId === 'comment-add-submit-btn-new') {
          this.resetCommentAddForm()
        }
        if (btnId === 'comment-add-submit-btn-close') {
          this.closeCommentAddDialog()
        }
      } else {
        Message.error(res.msg)
      }
    })
  }

  this.getCommentsList = function (taskId) {
    return GET(`/admin/qc/comment-list/${taskId}`)
  }

  this.postCommentsList = function (taskId, comment) {
    return POST('/admin/qc/comment', [{ taskId, ...comment }])
  }

  this.getObjectsList = function (scene) {
    return axios.get(`${process.env.VUE_APP_PYTHON_API}/objs_of_scene`, { params: { scene: scene } })
  }

  this.findObject = function (objectList, objId) {
    if (objectList.length > 0) {
      if (objId) {
        const obj = objectList.find((item) => Number(item.id) === Number(objId))
        return `${obj.id}-${obj.category}`
      } else {
        return '共性问题'
      }
    }else{
      return '未标注'
    }
  }

  this.addCommentBtn.onclick = this.addCommentListItem.bind(this)
  this.commentAddDialogClose.onclick = this.closeCommentAddDialog.bind(this)
  this.commonCommentRadio.onclick = this.radioClick.bind(this)
  this.singleItemCommentRadio.onclick = this.radioClick.bind(this)
  this.commentAddSubmitBtnNew.onclick = this.addCommentSubmit.bind(this)
  this.commentAddSubmitBtnClose.onclick = this.addCommentSubmit.bind(this)
  this.commentAddCancelBtn.onclick = this.closeCommentAddDialog.bind(this)
  this.commentListUl.onclick = this.editCommentListItem.bind(this)
}
