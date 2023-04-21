import customTrans from '@/components/MdEditor/src/markdownIt/customMark/custom'

export function md2html(content: string) {
  return customTrans(content)
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
