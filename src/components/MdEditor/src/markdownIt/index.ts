import MarkdownIt from 'markdown-it'

import './prism.min.js'
import './prism.min.css'

// @ts-ignore
import MarkdownItAbbr from 'markdown-it-abbr'
import MarkdownItAnchor from 'markdown-it-anchor'
// @ts-ignore
import MarkdownItEmoji from 'markdown-it-emoji'
// @ts-ignore
import MarkdownItFootnote from 'markdown-it-footnote'
// @ts-ignore
import MarkdownItIns from 'markdown-it-ins'
// @ts-ignore
import MarkdownItKatex from '@iktakahiro/markdown-it-katex'
// @ts-ignore
import MarkdownItMark from 'markdown-it-mark'
// @ts-ignore
import MarkdownItSub from 'markdown-it-sub'
// @ts-ignore
import MarkdownItSup from 'markdown-it-sup'
// @ts-ignore
import MarkdownItTaskLists from 'markdown-it-task-lists'

import { colorBlockquote } from './customMark/blockquote'
import { maccodes } from './customMark/maccodes'
import { lazyImage } from './customMark/lazyimage'

declare const Prism: any

Prism.manual = true

const Markdown = new MarkdownIt({
  html: true,
  xhtmlOut: false,

  breaks: false,
  linkify: false,
  typographer: false,

  quotes: '\u201C\u201D\u2018\u2019',

  highlight(str, lang) {
    if (lang && Prism.languages[lang]) {
      try {
        return Prism.highlight(str, Prism.languages[lang], lang)
      } catch {
        ;(e: any) => {
          console.log(e)
        }
      }
    }

    return '' // use external default escaping
  }
})
  .use(colorBlockquote)
  .use(maccodes)
  .use(lazyImage)
  .use(MarkdownItAbbr)
  .use(MarkdownItAnchor)
  .use(MarkdownItEmoji)
  .use(MarkdownItFootnote)
  .use(MarkdownItIns)
  .use(MarkdownItKatex, {
    trust: true
  })
  .use(MarkdownItMark)
  .use(MarkdownItSub)
  .use(MarkdownItSup)
  .use(MarkdownItTaskLists)

export { Markdown }
