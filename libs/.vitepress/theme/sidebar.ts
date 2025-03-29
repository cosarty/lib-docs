import { DefaultTheme } from 'vitepress'

const sidebar: DefaultTheme.Sidebar = {
  '/docs/practices': [
    {
      text: 'storage',
      link: '/docs/practices/storage',
    },
    {
      text: '横屏检测',
      link: '/docs/practices/listenPortraitLandscape',
    },
    {
      text: 'ossClient',
      link: '/docs/practices/aliOss',
    },
    {
      text: 'idConverter',
      link: '/docs/practices/idConverter',
    },
    {
      text:'主题切换（Sass）',
      link:'/docs/practices/themeChange(scss)'
    },
    
    {
      text:'API密钥生成器',
      link:'/docs/practices/apiKeyGenerator'
    },

  ],
  '/docs/tools': [
    {
      text: '函数',
      link: '/docs/tools/functions',
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
  '/docs/styles': [
    {
      text:'遮罩层合集',
      link:'/docs/styles/MaskCollection'
    },
    {
      text:'按钮合集',
      link:'/docs/styles/Buttons'
    }
  ]
}

export default sidebar

