import { Markdown } from '@/components/MdEditor/src/markdownIt'

export const markdownRenderer = {
  core: (str: string) => {
    return Markdown.render(str)
  },
  extra: [] as ((str: string) => string)[],
  use(renderer: (str: string) => string) {
    this.extra.push(renderer)
  },
  setCore(renderer: (str: string) => string) {
    this.core = renderer
  },
  render(str: string) {
    let result = this.core(str)

    this.extra.forEach((v) => {
      result = v(result)
    })

    return result
  }
}

export function md2html(content: string) {
  return markdownRenderer.render(content)
}

/**
 * 生成描述
 * @param htmlContent 文章html
 * @returns desc内容
 */
export const genDesc = (htmlContent: string) => {
  const $tmp = document.createElement('div')
  $tmp.innerHTML = htmlContent
  if ($tmp.textContent) {
    return $tmp.textContent.replace(/\s+/gm, ' ').slice(0, 162)
  }
  return '这篇文章没有描述，你可以试着脑补一下'
}
