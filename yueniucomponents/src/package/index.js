import HelloWorld from "./HelloWorld.vue";

const coms = [HelloWorld];
const install = function (Vue) {
  coms.forEach((com) => {
    Vue.component(com.name, com);
  });
};

export default install;
