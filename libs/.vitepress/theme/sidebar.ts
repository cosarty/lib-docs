import { DefaultTheme } from 'vitepress'

const sidebar: DefaultTheme.Sidebar = {
  '/docs/practices': [
    {
      text: 'Storage',
      link: '/docs/practices/storage',
    },
    {
      text: '横屏检测',
      link: '/docs/practices/listenPortraitLandscape',
    },
  ],
  '/docs/tools': [
    {
      text: '函数',
      link: '/docs/tools/functions',
    },
    {
      text: 'npm工具库',
      link: '/docs/tools/tools',
    },
    {
      text: '正则表达式',
      link: '/docs/tools/regexp',
    },
    {
      text: 'sass工具集合',
      link: '/docs/tools/sass-tools',
    },
  ],
}

export default sidebar

