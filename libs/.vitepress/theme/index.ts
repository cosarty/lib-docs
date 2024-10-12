import DefaultTheme from 'vitepress/theme';
import { EnhanceAppContext, Theme } from 'vitepress';
import Layout from './layout/index.vue';
import './styles/custom.scss';
import DemoBlock from './components/DemoBlock/index.vue';
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
export default {
  ...DefaultTheme,
  enhanceApp({ app, router, siteData }: EnhanceAppContext) {
    app.component('DemoBlock', DemoBlock);
    app.use(ElementPlus);
  },
  extends: {},
  Layout,
} as Theme;
