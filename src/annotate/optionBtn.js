import { taskType } from './getPathParams'
import { GET, POST } from '@/utils/http-client.js'
import { saveWorldList } from "./save.js"
import { objIdManager } from "./obj_id_list.js";
import { Message, MessageBox } from 'element-ui'

const initOptionBtn = () => {
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

console.log(7777777777777777777777,this.data)

  this.exitButton.onclick = () => {
    this.exitTask()
  }

  this.fnSuspendButton.onclick = () => {
    this.ssWork(1)
  }

  this.fnSubmitButton.onclick = () => {
    this.ssWork(0)
  }

  this.fnRejectButton.onclick = () => {
    this.tsWork(1)
  }

  this.fnPassButton.onclick = () => {
    this.tsWork(0)
  }

  this.fnQfbutton.onclick = () => {
    this.acptWork(0)
  }

  this.fnDisqfButton.onclick = () => {
    this.acptWork(1)
  }

  this.exitTask = () => {
    const host = document.referrer
    const fromPath = localStorage.getItem('fromPath')
    window.location.href = `${host}#${fromPath}`
  }

//标注 保存或挂起
  this.ssWork = (type) => {
    let scene = this.data.world.frameInfo.scene;
    objIdManager.load_obj_ids_of_scene(scene, (objs) => {
      const data = {
        boxCount : objs.reduce((a, b) => a + b.count, 0),
        homeworkId:this.data.sceneAllData.homework_list.find(f=>f.name === this.data.world.frameInfo.frame)['id'],
        tagTime:'',
        type:type
      }
      this.suspendOrSubmitWork({...data}).then(res=>{
        if(res.success){
          if(res.msg === "T"){
            Message.success('当前作业操作成功！')
            this.nextWork()
          }
          if(res.msg === 'C'){
            this.optionCompleteMessageBox("已完成所有任务的标注操作，是否返回到任务列表？")
          }
        }else{
          Message.error(res.msg)
        }
      })
    });
  }
//一检和二检 通过或驳回
  this.tsWork = (type) => {
    const data =  {
      homeworkId:this.data.sceneAllData.homework_list.find(f=>f.name === this.data.world.frameInfo.frame)['id'],
      type:type
    }
    this.testWork({...data}).then(res=>{
      if(res.success){
        if(res.msg === "T"){
          Message.success('当前作业操作成功！')
          this.nextWork()
        }
        if(res.msg === 'S'){
          this.optionCompleteMessageBox("已完成所有任务的质检操作，是否返回到任务列表？")
        }
      }else{
        Message.error(res.msg)
      }
    })
  }

//验收 合格或不合格
this.acptWork = (type) => {
  const data =  {
    homeworkId:this.data.sceneAllData.homework_list.find(f=>f.name === this.data.world.frameInfo.frame)['id'],
    type:type
  }
  this.acceptWork({...data}).then(res=>{
    if(res.success){
      if(res.msg === "T"){
        Message.success('当前作业操作成功！')
        this.nextWork()
      }
      if(res.msg === 'S'){
        this.optionCompleteMessageBox("已完成所有任务的验收操作，是否返回到任务列表？")
      }
    }else{
      Message.error(res.msg)
    }
  })
}

// 操作完成提示框
this.optionCompleteMessageBox = (msg) => {
  MessageBox.confirm(msg, '操作确认', {
    distinguishCancelAndClose: true,
    confirmButtonText: '确定',
    cancelButtonText: '取消'
  }).then(()=>{
    this.exitTask()
  }).catch(()=>{
    Message.info('操作取消！')
  })
}

// 单个操作完成跳转下一个
this.nextWork = () => {
  frameManager.toNextFrame();
  frameManager.after_next();
}

// 单个作业的提交与挂起
  this.suspendOrSubmitWork = ({boxCount,homeworkId,tagTime='',type}) => {
    return POST('/admin/tagging/tag-homework',{boxCount,homeworkId,tagTime,type})
  }
  // 单张作业质检接口
  this.testWork = ({homeworkId,type}) => {
    return POST(`/admin/qc/qc-homework/${homeworkId}/${type}`)
  }
  // 单张作业验收接口
  this.acceptWork = ({homeworkId,type}) => {
    return POST('/admin/accept/at-homework',{homeworkId,type,projectId:'',rejectCause:'',})
  }
}

export { initOptionBtn, OptionButtons }
