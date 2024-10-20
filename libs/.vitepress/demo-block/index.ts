import fs from 'fs';
import path, { extname, join, relative } from 'path';
import { fileURLToPath } from 'url';
import type MarkdownIt from 'markdown-it';
import type { StateBlock } from 'markdown-it/index.js';

const { resolve } = path;
// @ts-ignore
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// demo组件的根路径
const demoComponentsPath = resolve(
  __dirname,
  '../theme/components/DemoBlock.vue'
);

// 解析的目录
const sourceRootPath = resolve(__dirname, '../../src');
/**
 * @name getDemoLabel
 * @desc 获取demo标签里的属性
 * @param {string} demo demo的标签字符串
 * @param {string} attr 需要获取的attr,不存在时获取标签里的内容
 * @return {string} 返回获取到的demo标签属性，如src
 */
const getDemoLabel = (demo = '', attr?: any) => {
  let reg = attr
    ? new RegExp(`<DemoBlock[^>]+${attr}=['"]([^'"]+)['"]`)
    : /<DemoBlock[\s\S]*?>([\s\S]*?)(<\/DemoBlock>|\/>)$/;
  let match = demo.match(reg);
  return match?.[1] || '';
};

const randerTemplate = (
  state: StateBlock,
  str: string,
  slotName: string,
  lang: string
) => {
  state.push('html_block', '', 0).content = `<template #${slotName} >\n`;
  const demoToken = state.push('fence', 'code', 0);
  demoToken.content = str;
  demoToken.markup = '```';
  demoToken.info = lang;
  state.push('html_block', '', 0).content = '</template>\n';
};

/**
 1.双标签就跳过插入
 2.支持文件夹形式☆
 */
/**
 * tip
 * 目前只支持单标签和有换行内容的双标签
 */
export default (md: MarkdownIt) => {
  // 提高优先级
  md.block.ruler.before('fence', 'demo-block', (state, startLine) => {
    const pos = state.bMarks[startLine] + state.tShift[startLine];
    const max = state.eMarks[startLine];
    let result = state.src.substring(pos, max);

    const demoLabels = result.match(/<DemoBlock([\s\S]*?)(?<single>\/)?>/); // 获取所有的demo标签
    if (!demoLabels) return false;
    const { 0: demo, groups } = demoLabels;

    let codeStr = ''; //demo中间字符串
    let demoStr = ''; //demo中间字符串
    const source = getDemoLabel(demo, 'src'); //demo src
    const demoSrc = getDemoLabel(demo, 'demo'); //demo src
    const sourcePath = join(sourceRootPath, source); //demo md的绝对路径
    const demoPath = join(sourceRootPath, demoSrc);
    let demoRelativePath = '';
    if (source && fs.existsSync(sourcePath)) {
      codeStr = fs.readFileSync(sourcePath).toString();
    } else {
      codeStr = 'src文件不存在';
    }
    if (demoSrc && fs.existsSync(demoPath)) {
      demoStr = fs.readFileSync(demoPath).toString();
      demoRelativePath = relative(demoComponentsPath, demoPath);
    } else {
      demoStr = 'demo文件不存在';
    }

    const lang = extname(sourcePath).replace('.', '');

    result = demo.replace(
      /(\/?)>/,
      `codeStr="${encodeURIComponent(
        codeStr
      )}"  demoPath="${demoRelativePath}" language="${lang}">`
    );

    // 开头
    state.push('html_block', '', 0).content =
      result.at(-1) === '\n' ? result : result + '\n';

    if (groups?.single === '/') {
      // code插槽
      randerTemplate(
        state,
        demoStr,
        'demo',
        extname(demoPath).replace('.', '')
      );
    }

    // default 插槽
    randerTemplate(state, codeStr, 'default', lang);

    if (groups?.single === '/') {
      // 结尾
      state.push('html_block', '', 0).content = '</DemoBlock >\n';
    }

    state.line = startLine + 1;
    return true;
  });
};
