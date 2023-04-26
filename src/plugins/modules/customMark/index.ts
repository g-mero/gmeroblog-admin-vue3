import { Markdown } from '@/components/MdEditor/src/markdownIt'
import { markdownRenderer } from '@/utils/article'
import { colorBlockquote } from './src/blockquote'
import customTrans from './src/custom'
import { lazyImage } from './src/lazyimage'
import { maccodes } from './src/maccodes'

export default {
  name: 'customMark',
  action: {
    init() {
      // 设置渲染器
      Markdown.use(colorBlockquote).use(maccodes).use(lazyImage)
      markdownRenderer.setCore(customTrans)
      // @ts-ignore
      import('./src/assets/justy.min.js')
      import('./src/assets/bootstrap.min.css')
    }
  }
}
