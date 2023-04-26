import { Markdown } from '@/components/MdEditor/src/markdownIt'
import { markdownRenderer, pluginHookMdEditor } from '@/utils/article'
import { colorBlockquote } from './src/blockquote'
import customTrans from './src/custom'
import { lazyImage } from './src/lazyimage'
import { maccodes } from './src/maccodes'

import './src/assets/article.scss'
import type { SettingItem } from '@/components/Form/gmForm'

export default {
  name: 'justy_customMark',
  desc: '这是justy主题的自定义编辑器语法插件，需要主题支持，如果您更换了主题那么就可能需要关闭此插件',
  settings: [{name:''}] as SettingItem[],
  init() {
    // 设置渲染器
    Markdown.use(colorBlockquote).use(maccodes).use(lazyImage)
    markdownRenderer.setCore(customTrans)

    // 修改mdeditor
    pluginHookMdEditor.previewRenderer = (str: string) => {
      let result = markdownRenderer.render(str)

      const $tmp = document.createElement('div')
      $tmp.innerHTML = result

      const imgs = $tmp.querySelectorAll('img')

      imgs.forEach((img) => {
        const dataSrc = img.getAttribute('data-src')
        if (dataSrc) {
          img.src = dataSrc
          img.removeAttribute('data-src')
          img.removeAttribute('onerror')
        }
      })

      result = $tmp.innerHTML

      $tmp.remove()

      return result
    }
    // @ts-ignore
    import('./src/assets/justy.min.js')
    import('./src/assets/bootstrap.min.css')
  },
  enabled: false
}
