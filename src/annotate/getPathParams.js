// 获取路由参数
const getPathParams = () => {
  const href = window.location.href
  const params = new Map(
    href
      .substring(href.lastIndexOf('?') + 1)
      .split('&')
      .map((p) => p.split('='))
  )
  return {
    taskId : params.get('taskId') || '',
    workId : params.get('workId') || '',
    taskType : params.get('type') || ''
  }
}

// 定时检测dom是否加载完成
var clickDomTimer = null
const getClickDom = (fn) => {
  const dom = document.getElementsByClassName('frame-list-div')
  if(dom.length){
    fn(dom)
    if(!clickDomTimer)clearInterval(clickDomTimer)
  }else{
    clickDomTimer = setTimeout(()=>getClickDom(fn),10)
  }
}

export { getPathParams, getClickDom }
