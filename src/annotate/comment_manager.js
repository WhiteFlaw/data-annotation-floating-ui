import axios from 'axios'
import { GET, POST } from '@/utils/http-client.js'
import { MessageBox, Message } from 'element-ui'
import { innerDOMString } from './util.js'
import { commentManagerTemplate } from './template/commentManagerTemplate.js'

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
  this.taskId = 0
  this.taskName = ''
  this.worldList = []
  this.commentsList = []
  this.commentObj = {}

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
      this.renderCommentsList(this.taskName)
    }
  }

  this.renderCommentsList = function (taskName) {
    const self = this
    this.getCommentsList(taskName).then((res) => {
      if (res.success) {
        this.commentsList = [...res.data]
        if (!res.data.length) return false
        let commentLi = res.data
          .map(function (c) {
            return `<li><span>${self.findObject(self.objectsList, c.objId)}</span><span>${c.info}</span><span id="edit-object-${c.id}">修改</span></li>`
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
    this.commentAddDialog.style.display = 'block'
  }

  this.editCommentListItem = function (event) {
    if (event.target.innerText !== '修改') return
    const id = event.target.getAttribute('id').split('-')[2]
    this.commentObj = this.commentsList.find((item) => Number(item.id) === Number(id))
    this.commentAddDialog.style.display = 'block'
    this.selectedType = String(this.commentObj.type)
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
    console.log('保存', btnId)
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

    this.postCommentsList(this.taskId, this.taskName, comment).then((res) => {
      if (res.success) {
        Message.success(res.msg)
        this.renderCommentsList(this.taskName)
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

  this.getCommentsList = function (taskName) {
    return GET('/admin/qc/comment-list/', { taskName })
  }

  this.postCommentsList = function (taskId, taskName, comment) {
    return POST('/admin/qc/comment', [{ taskId, taskName, ...comment }])
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
