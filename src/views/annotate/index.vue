<template>
  <div id="main-editor" class="editor-container" />
</template>

<script>
import { Data } from '@/annotate/data.js'
import { Config } from '@/annotate/config.js'
import { Editor } from '@/annotate/editor.js'
import { innerDOMString } from '@/annotate/util.js'
import { backupManager } from '@/annotate/backup/manager.js'
import { editorTemplate } from '@/annotate/template/editorTemplate'

export default {
  name: 'Home',
  data() {
    return {
      pointsGlobalConfig: ''
    }
  },
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      console.log(13212414332, from)
      if (from.fullPath !== '/') localStorage.setItem('fromPath', from.fullPath)
    })
  },
  beforeRouteLeave(to, from, next) {
    const htmlClassName = document.documentElement.className
    console.log(htmlClassName)
    if (htmlClassName.search('theme-dark') !== -1) {
      document.documentElement.className = ''
    }
    next()
  },
  created() {
    this.pointsGlobalConfig = new Config()

    window['pointsGlobalConfig'] = this.pointsGlobalConfig

    this.pointsGlobalConfig.load()

    document.documentElement.className = `theme-${this.pointsGlobalConfig.theme}`

    document.body.addEventListener('keydown', (event) => {
      if (event.ctrlKey && 'asdv'.indexOf(event.key) !== -1) event.preventDefault()
    })

    this.$nextTick(() => {
      this.start()
    })
  },
  methods: {
    async start() {
      const mainEditor = await this.createMainEditor()
      // TODO 根据URL加载对应的scene与frame
      const url_string = `http://127.0.0.1:8081/`
      const url = new URL(url_string)

      // language
      const scene = url.searchParams.get('scene')
      const frame = url.searchParams.get('frame')

      if (scene && frame) {
        mainEditor.load_world(scene, frame)
      }
    },
    async createMainEditor() {
      const maindiv = document.querySelector('#main-editor')
      innerDOMString(editorTemplate, maindiv)

      const editorCfg = this.pointsGlobalConfig
      const dataCfg = this.pointsGlobalConfig

      const data = new Data(dataCfg)
      await data.init()

      const editor = new Editor(maindiv.lastElementChild, maindiv, editorCfg, data, 'main-editor')
      window['editor'] = editor
      editor.run()

      backupManager.initEditor(editor)

      return editor
    }
  }
}
</script>

<style scoped>
@import '../../styles/annotate/main.css';
@import '../../styles/annotate/frame-manager.css';
@import '../../styles/annotate/image-manager.css';
@import '../../styles/annotate/comment-manager.css';
</style>
