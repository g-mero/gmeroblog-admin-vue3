import { Markdown } from '@/components/MdEditor/src/markdownIt'
import { markdownRenderer } from '@/utils/article'
import { colorBlockquote } from './src/blockquote'
import customTrans from './src/custom'
import { lazyImage } from './src/lazyimage'
import { maccodes } from './src/maccodes'

import './src/assets/article.scss'

export default {
  name: 'justy_customMark',
  desc: '这是justy主题的自定义编辑器语法插件，需要主题支持，如果您更换了主题那么就可能需要关闭此插件',
  init() {
    // 设置渲染器
    Markdown.use(colorBlockquote).use(maccodes).use(lazyImage)
    markdownRenderer.setCore(customTrans)
    // @ts-ignore
    import('./src/assets/justy.min.js')
    import('./src/assets/bootstrap.min.css')
  },
  enabled: false
}
