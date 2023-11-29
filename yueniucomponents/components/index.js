import searchArea from './searchArea/index.vue';
import './index.scss'
// 存储组件列表
const coms = [searchArea];
const install = function (Vue) {
  coms.forEach((com) => {
    Vue.component(com.name, com);
  });
};

export default install;