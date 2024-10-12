import { defineConfig } from 'vitepress';
import demoBlock from './demo-block';
import navbar from './theme/navbar';
import sidebar from './theme/sidebar';
export default defineConfig({
  title: '自用工具库',
  description: '柠檬的自用工具库',
  srcDir: './src',
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
    config: (md) => {
      md.use(demoBlock);
    },
  },
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          api: 'modern-compiler', // or "modern"
        },
      },
    },
  },
  cleanUrls: true,
  metaChunk: true, // 缓存元数据
  lastUpdated: true, // 显示git 的最后更新时间
  themeConfig: {
    logo: '/images/logo.png',
    // lastUpdatedText:'',
    nav: navbar,

    sidebar,
    socialLinks: [
      { icon: 'github', link: 'https://github.com/vuejs/vitepress' },
    ],
    footer: {
      message: '基于 MIT 许可发布.',
      copyright: '版权所有 © 2024 cosarty',
    },
  },
});
