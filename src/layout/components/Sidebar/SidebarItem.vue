<template>
  <div v-if="!item.hidden">
    <template v-if="!item.list||item.list.length==0">
      <app-link :to="'/unification/unificationPage'">
        <el-menu-item :index="item.name">
          {{ item.name }}
        </el-menu-item>
      </app-link>
    </template>

    <el-submenu v-else ref="subMenu" :index="item.name" popper-append-to-body>
      <template slot="title">
        {{ item.name }}
      </template>
      <sidebar-item
        v-for="child in item.list"
        :key="child.name"
        :is-nest="true"
        :item="child"
        base-path="/unification/unificationPage"
        class="nest-menu"
      />
    </el-submenu>
  </div>
</template>

<script>
// import path from 'path'
// import { isExternal } from '@/utils/validate'
// import Item from './Item'
import AppLink from './Link'
import FixiOSBug from './FixiOSBug'

export default {
  name: 'SidebarItem',
  components: { AppLink },
  mixins: [FixiOSBug],
  props: {
    // route object
    item: {
      type: Object,
      required: true
    },
    isNest: {
      type: Boolean,
      default: false
    },
    basePath: {
      type: String,
      default: ''
    }
  },
  data() {
    return {}
  },
  methods: {

  }
}
</script>
