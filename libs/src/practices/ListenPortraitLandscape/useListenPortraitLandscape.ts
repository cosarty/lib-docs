import { IsMobileRegx } from '../../constants/regexp'
import { onUnmounted } from 'vue'

export const useListenPortraitLandscape = ({
  portraitCallback,
  landscapeCallback,
}: {
  portraitCallback?: () => void
  landscapeCallback?: () => void
}) => {
  const isMobile = IsMobileRegx.test(navigator.userAgent.toLowerCase())

  let _portraitCallback = portraitCallback || function () {}
  let _landscapeCallback = landscapeCallback || function () {}

  let renderTimeout: NodeJS.Timeout
  let MatchMedia: MediaQueryList

  // 向下兼容方案
  const resizeCallback = () => {
    renderTimeout && clearTimeout(renderTimeout)
    renderTimeout = setTimeout(() => {
      if (window.innerHeight / window.innerWidth < 0.67) _portraitCallback()
      else _landscapeCallback()
    }, 0)
  }

  // 现代标准方案
  const mediaCallback = (mql: MediaQueryList | MediaQueryListEvent) => {
    if (!isMobile) return
    if (mql?.matches) _portraitCallback()
    else _landscapeCallback()
  }

  // 监听入口 (因为window.matchMedia方式在实际项目中，检测时个别机型存在支持但无响应问题，所以慎用此方式！)

  if (window.matchMedia) {
    MatchMedia = window.matchMedia('(orientation: landscape)')
    mediaCallback(MatchMedia)
    MatchMedia.addEventListener('change', mediaCallback)
  } else {
    window.addEventListener('resize', resizeCallback, false)
  }

  onUnmounted(() => {
    if (MatchMedia) MatchMedia.removeEventListener('change', mediaCallback)
    else window.removeEventListener('resize', resizeCallback)
  })
}

