import { defineConfig } from 'vitepress'
import demoBlock from './demo-block'
import navbar from './theme/navbar'
import sidebar from './theme/sidebar'
import vueJsx from '@vitejs/plugin-vue-jsx'
export default defineConfig({
  title: '自用工具库',
  description: '柠檬的自用工具库',
  srcDir: './src',
  lang: 'zh-CN',
  markdown: {
    container: {
      tipLabel: '提示',
      warningLabel: '警告',
      dangerLabel: '危险',
      infoLabel: '信息',
      detailsLabel: '详细信息',
    },
    theme: {
      dark: 'one-dark-pro',
      light: 'catppuccin-latte',
    },
    lineNumbers: true,
    image: {
      // 默认禁用图片懒加载
      lazyLoading: true,
    },
    toc: { level: [1, 2] },
    config: md => {
      md.use(demoBlock)
    },
  },
  vite: {
    resolve: {
      alias: {
        // @ 替代为 src
        // '@': resolve(__dirname, 'src'),
        // @component 替代为 src/component
      },
    },
    css: {
      preprocessorOptions: {
        scss: {
          api: 'modern-compiler', // or "modern"
        },
      },
    },
    plugins: [vueJsx()],
  },
  cleanUrls: true,
  metaChunk: true, // 缓存元数据
  lastUpdated: true, // 显示git 的最后更新时间
  themeConfig: {
    outline: {
      level: [2, 3], // 只显示 <h2> 和 <h3> 标题
      label: '本页目录', // 将目录标题改为中文
    },
    logo: '/images/logo.png',
    nav: navbar,
    docFooter: {
      prev: '上一页',
      next: '下一页',
    },
    editLink: {
      pattern: 'https://github.com/cosarty/lib-docs/edit/master/libs/src/:path',
      text: '编辑此页面',
    },
    lastUpdatedText: '最后更新',
    sidebarMenuLabel: '菜单',
    returnToTopLabel: '返回顶部',
    darkModeSwitchLabel: '主题切换',
    sidebar,
    socialLinks: [
      { icon: 'github', link: 'https://github.com/cosarty/lib-docs' },
    ],
    footer: {
      message: '基于 MIT 许可发布.',
      copyright: '版权所有 © 2024 cosarty',
    },
  },
})

