<template>
  <div id="main-editor" class="editor-container" />
</template>

<script>
import { Data } from '@/annotate/data.js'
import { Config } from '@/annotate/config.js'
import { Editor } from '@/annotate/editor.js'
import { analyseDomStr } from '@/annotate/util.js'
import { manager } from '@/annotate/backup/manager.js'
import { editorTemplate } from '@/annotate/template/editorTemplate'

export default {
  name: 'Home',
  data() {
    return {
      pointsGlobalConfig: ''
    }
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
      analyseDomStr(editorTemplate, maindiv)

      const editorCfg = this.pointsGlobalConfig
      const dataCfg = this.pointsGlobalConfig

      const data = new Data(dataCfg)
      await data.init()

      const editor = new Editor(
        maindiv.lastElementChild,
        maindiv,
        editorCfg,
        data,
        'main-editor'
      )
      window['editor'] = editor
      editor.run()

      manager.initEditor(editor)

      return editor
    }
  }
}
</script>

<style scoped>
@import "../../styles/annotate/main.css";
</style>
