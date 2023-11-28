<template>
  <div id="app">

   <searchArea >12331</searchArea>
   
  </div>
</template>

<script>
import searchArea from '../components/searchArea/index.vue';
export default {
  name: 'App',
  components: {searchArea}
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  padding: 30px;
}
</style>
