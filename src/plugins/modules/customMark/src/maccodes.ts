import { camelCase, upperFirst } from 'lodash-es'
import utils from 'markdown-it/lib/common/utils'

const escapeHtml = utils.escapeHtml
const unescapeAll = utils.unescapeAll

export function maccodes(md: markdownit) {
  md.renderer.rules.code_block = function (tokens, idx, options, env, slf) {
    const token = tokens[idx]
    token.attrJoin('class', 'gmcode rounded')
    return `<pre class="gmcode rounded"${slf.renderAttrs(token)}><code>${escapeHtml(
      tokens[idx].content
    )}</code></pre>\n`
  }

  md.renderer.rules.fence = function (tokens, idx, options, env, slf) {
    const token = tokens[idx]
    const info = token.info ? unescapeAll(token.info).trim() : ''
    // 默认语言名
    let langName = 'Plain Text'
    let langAttrs = ''
    let highlighted
    let i
    let arr
    let tmpAttrs

    if (info) {
      arr = info.split(/(\s+)/g)
      langName = arr[0]
      langAttrs = arr.slice(2).join('')
    }

    if (options.highlight) {
      highlighted =
        options.highlight(token.content, langName, langAttrs) || escapeHtml(token.content)
    } else {
      highlighted = escapeHtml(token.content)
    }

    if (highlighted.indexOf('<pre') === 0) {
      return `${highlighted}\n`
    }
    const toolbar = `<div class="toolbar">
      <div class="toolbar-item">
      <span>${upperFirst(camelCase(langName))}</span>
      </div><div class="toolbar-item">
      <button class="d-inline-block code-copy-btn" type="button" title="复制代码"/>\
      <i class="copy-icon"><svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">\
      <g fill="none" fill-rule="evenodd"><path d="M24 0v24H0V0h24ZM12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035c-.01-.004-.019-.001-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427c-.002-.01-.009-.017-.017-.018Zm.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093c.012.004.023 0 .029-.008l.004-.014l-.034-.614c-.003-.012-.01-.02-.02-.022Zm-.715.002a.023.023 0 0 0-.027.006l-.006.014l-.034.614c0 .012.007.02.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01l-.184-.092Z"/>
      <path fill="currentColor" d="M9 2a2 2 0 0 0-2 2v2h2V4h11v11h-2v2h2a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H9ZM4 7a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2H4Z"/>
      </g></svg></i></button></div></div>`

    const rows = highlighted.split('\n').length
    const genrownum = () => {
      let row = ''

      for (let i = 0; i < rows - 1; i++) {
        row += `<span></span>`
      }

      return `<span aria-hidden="true" class="line-numbers-rows">${row}</span>`
    }

    // If language exists, inject class gently, without modifying original token.
    // May be, one day we will add .deepClone() for token and simplify this part, but
    // now we prefer to keep things local.
    if (info) {
      i = token.attrIndex('class')
      tmpAttrs = token.attrs ? token.attrs.slice() : []

      if (i < 0) {
        tmpAttrs.push(['class', options.langPrefix + langName])
      } else {
        tmpAttrs[i] = tmpAttrs[i].slice() as [string, string]
        tmpAttrs[i][1] += ` ${options.langPrefix}${langName}`
      }

      // Fake token just to render attributes
      const tmpToken = token
      tmpToken.attrs = tmpAttrs

      return (
        `<div class="gmcode-wrapper rounded">` +
        `${toolbar}<pre class="line-numbers gmcode">
        ${genrownum()}<code${slf.renderAttrs(tmpToken)}>${highlighted}</code>
        </pre></div>`
      )
    }

    return (
      `<div class="gmcode-wrapper rounded">` +
      `${toolbar}<pre class="line-numbers gmcode">
      ${genrownum()}<code${slf.renderAttrs(token)}>${highlighted}</code>
      </pre></div>`
    )
  }
}
