class lazyImageOpt {
  class?: string
  loadImg!: string
  errorImg!: string
}

const defaultOpt = {
  class: 'lazy-load shadow',
  loadImg: '/theme/justy/assets/img/img-loading.gif',
  errorImg: '/theme/justy/assets/img/img-404.gif',
}

export function lazyImage(md: markdownit, opt?: lazyImageOpt) {
  md.renderer.rules.image = function (tokens, idx, options, env, slf) {
    if (opt === undefined) opt = defaultOpt
    const token = tokens[idx]

    // @ts-expect-error:XXX
    token.attrs[token.attrIndex('alt')][1] = slf.renderInlineAsText(
      // @ts-expect-error:xXX
      token.children,
      options,
      env,
    )

    token.attrSet('data-src', token.attrGet('src') || '...')
    token.attrSet('class', opt.class || defaultOpt.class)
    token.attrSet('src', opt.loadImg)
    token.attrSet(
      'onerror',
      `javascript:this.src='${opt.errorImg}';this.onerror = null`,
    )

    return slf.renderToken(tokens, idx, options)
  }
}
