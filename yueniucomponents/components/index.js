import comone from './com/index.vue'
import xomone from './xom/index.vue'
import searchArea from './searchArea/index.vue';
// 存储组件列表
const coms = [comone,xomone,searchArea];
const install = function (Vue) {
  coms.forEach((com) => {
    Vue.component(com.name, com);
  });
};

export default install;