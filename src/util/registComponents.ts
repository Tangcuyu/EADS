/* 自动化注册全局组件 */
import Vue from 'vue';

const modules = [
  require.context('../components/common/basemap', true, /\.vue$/),
  require.context('../views/common', true, /\.vue$/),
  require.context('../views/earthquake/panelcontainer', true, /\.vue$/),
  require.context('../views/earthquake/themeprimary', true, /\.vue$/),
  require.context('../views/flood', true, /\.vue$/),
  require.context('../views/typhoon', true, /\.vue$/)
];

modules.forEach(e => {
  e.keys().forEach( filename => {

    // 获取组件配置
    const componentConfig = e(filename);

    // 剥去文件名开头的./和结尾的.vue扩展名
    const componentName = filename.replace(/^\.\//, '').replace(/\.vue$/, '');

    const component = Vue.component(
      componentName.replace(/\//, '-'),
      componentConfig.default || componentConfig
    );
  });
});
