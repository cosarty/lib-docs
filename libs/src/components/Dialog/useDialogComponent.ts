import { createVNode, render, VNode, Component, h } from 'vue'

import Dialog, { type DialogProps } from './Dialog.vue'
import { omit, pick } from 'lodash-es'

export interface Options<T = any> extends DialogProps {
  appendTo?: HTMLElement | string
  props?: T
  footer?: () => VNode
  [key: string]: unknown
}

export interface CommandComponent<T> {
  (options: Options<T>): VNode
  close: () => void
}

const getAppendToElement = (optAppendTo: Options['appendTo']): HTMLElement => {
  //appendTo ： Html body标签
  let appendTo: HTMLElement | null = document.body
  if (optAppendTo) {
    if (typeof optAppendTo === 'string') {
      appendTo = document.querySelector<HTMLElement>(optAppendTo)
    }
    if (optAppendTo instanceof HTMLElement) {
      appendTo = optAppendTo
    }
    if (!(appendTo instanceof HTMLElement)) {
      appendTo = document.body
    }
  }
  return appendTo
}

const initInstance = <T extends VNode>(
  Component: T,
  container: HTMLElement,
  appendTo: Options['appendTo'],
) => {
  //通过作为参数传进来dom,创建dom
  const vNode = createVNode(Component)

  render(vNode, container)

  getAppendToElement(appendTo).appendChild(container)
  return vNode
}

const defaultConfigOptions: Options = {
  confirmText: '确认',
  cancelText: '取消',
  props: {},
  showConfirm: true,
  showCancel: true,
  title: '弹窗',
  confirmCallBack: () => {},
}

export const useDialogComponent = <P extends object>(
  Component: Component,
): CommandComponent<P> => {
  //创建节点
  const container = document.createElement('div')

  //销毁刚刚创建的节点
  const close = () => {
    render(null, container)
    container.parentNode?.removeChild(container)
  }

  const renderDialog = (component: VNode, options: Options) => {
    const slots = pick(options, ['footer'])
    const props = omit(options, ['footer', 'props']) as any

    const DialogCom = h(
      Dialog,
      {
        onClose: close,
        ...props,
        confirmCallBack() {
          // 回调实例
          return options.confirmCallBack?.(component?.component?.exposed)
        },
      },
      { default: () => component, ...slots },
    )
    return initInstance(DialogCom, container, options.appendTo)
  }

  const CommandComponent = (options: Options): VNode => {
    options = { ...defaultConfigOptions, ...(options || {}) }
    const vnode = h(Component, options.props)

    const vNode = renderDialog(vnode, options)

    return vNode
  }

  CommandComponent.close = close

  return CommandComponent
}

export default useDialogComponent
