<template>
  <div>
    <el-scrollbar ref="scrollContainer" :vertical="false" class="scroll-container" @wheel.native.prevent="handleScroll">
      <div
        v-for="tag in visitedViews"
        ref="tag"
        :key="tag.fullPath"
        :class="isActive(tag) ? 'active' : ''"
        :to="{ path: tag.path, query: tag.query, fullPath: tag.fullPath }"
        tag="span"
        class="tags-view-item"
        @contextmenu.prevent="openMenu(tag, $event)"
        @click="changePath(tag)"
      >
        {{ tag.title }}
        <span v-if="isAffix(tag)" class="el-icon-close" @click.stop="closeSelectedTag(tag)"></span>
      </div>
    </el-scrollbar>
    <ul v-show="visible" :style="{ left: left + 'px', top: top + 'px' }" class="contextmenu">
      <li @click="refreshSelectedTag">
        <i class="el-icon-refresh-right"></i> 刷新页面
      </li>
      <li v-if="selectedTag.fullPath!='/dashboard'&&selectedTag.fullPath==$store.getters.currentPath" @click="closeSelectedTag(selectedTag)">
        <i class="el-icon-close"></i> 关闭当前
      </li>
      <li v-if="visitedViews.length>2" @click="closeOthersTags">
        <i class="el-icon-circle-close"></i> 关闭其他
      </li>
      <li v-if="currentIndex>1" @click="closeLeftTags">
        <i class="el-icon-back"></i> 关闭左侧
      </li>
      <li v-if="visitedViews.length-1>currentIndex" @click="closeRightTags">
        <i class="el-icon-right"></i> 关闭右侧
      </li>
      <li v-if="visitedViews.length>=2" @click="closeAllTags">
        <i class="el-icon-circle-close"></i> 全部关闭
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  data() {
    return {
      visible: false,
      top: 0,
      left: 0,
      selectedTag: {}
    }
  },
  computed: {
    visitedViews() {
      console.log(this.$store.getters.cachedViews)
      return this.$store.getters.cachedViews
    },
    currentIndex() {
      return this.visitedViews.findIndex((item) => item.fullPath == this.selectedTag.fullPath)
    }
  },
  watch: {
    visible(value) {
      if (value) {
        document.body.addEventListener('click', this.closeMenu)
      } else {
        document.body.removeEventListener('click', this.closeMenu)
      }
    },
    '$route.path'() {
      this.closeMenu()
    }
  },
  methods: {
    changePath(tag) {
      this.$store.commit('system/SET_CURRENTPATH', tag.fullPath)
      this.$router.push({
        path: tag.path,
        query: tag.query,
        fullPath: tag.fullPath
      })
    },
    isActive(route) {
      return route.fullPath == this.$store.getters.currentPath
    },
    openMenu(tag, e) {
      const menuMinWidth = 105
      const offsetLeft = this.$el.getBoundingClientRect().left
      const offsetWidth = this.$el.offsetWidth
      const maxLeft = offsetWidth - menuMinWidth
      const left = e.clientX - offsetLeft + 70

      if (left > maxLeft) {
        this.left = maxLeft
      } else {
        this.left = left
      }

      this.top = e.clientY + 10
      this.visible = true
      this.selectedTag = tag
    },
    isAffix(tag) {
      if (tag.path == '/dashboard') {
        return false
      } else {
        return true
      }
    },
    refreshSelectedTag() {
      var routeList = JSON.parse(JSON.stringify(this.visitedViews))
      const index = routeList.findIndex((item) => item.fullPath == this.selectedTag.fullPath)
      routeList.splice(index, 1)
      this.$store.commit('system/SET_CACHEVIEWS', routeList)
      this.$nextTick(() => {
        routeList.splice(index, 0, this.selectedTag)
        this.toPath(routeList, this.selectedTag.fullPath, this.selectedTag.path)
      })
    },
    closeSelectedTag(tag) {
      var routeList = JSON.parse(JSON.stringify(this.visitedViews))
      const index = routeList.findIndex((item) => item.fullPath == tag.fullPath)
      routeList.splice(index, 1)
      this.toPath(routeList, routeList[routeList.length - 1].fullPath, routeList[routeList.length - 1].path)
    },
    closeOthersTags() {
      var routeList = JSON.parse(JSON.stringify(this.visitedViews))
      var whitePath = ['/dashboard', this.selectedTag.fullPath]
      routeList = routeList.filter((item) => whitePath.includes(item.fullPath))
      this.toPath(routeList, routeList[routeList.length - 1].fullPath, routeList[routeList.length - 1].path)
    },
    closeLeftTags() {
      var routeList = JSON.parse(JSON.stringify(this.visitedViews))
      routeList = routeList.filter((item, i) => i >= this.currentIndex || item.fullPath == '/dashboard')
      this.toPath(routeList, this.selectedTag.fullPath, this.selectedTag.path)
    },
    closeRightTags() {
      var routeList = JSON.parse(JSON.stringify(this.visitedViews))
      routeList = routeList.filter((item, i) => i <= this.currentIndex)
      this.toPath(routeList, this.selectedTag.fullPath, this.selectedTag.path)
    },
    closeAllTags() {
      var routeList = JSON.parse(JSON.stringify(this.visitedViews))
      routeList = routeList.filter((item) => item.fullPath == '/dashboard')
      this.toPath(routeList, routeList[routeList.length - 1].fullPath, routeList[routeList.length - 1].path)
    },
    toPath(routeList, fullPath, path) {
      this.$store.commit('system/SET_CURRENTPATH', fullPath)
      this.$store.commit('system/SET_CACHEVIEWS', routeList)
      this.$router.push({ path })
    },
    closeMenu() {
      this.visible = false
    },
    handleScroll() {
      this.visible = false
    }
  }
}
</script>

<style lang="scss" scoped>
.scroll-container {
  white-space: nowrap;
  position: relative;
  overflow: hidden;
  width: auto;
  margin: 0 20px;
  ::v-deep {
    .el-scrollbar__bar {
      bottom: 0px;
    }
    .el-scrollbar__wrap {
      height: 44px;
    }
  }
}
.tags-view-item {
  display: inline-block;
  position: relative;
  cursor: pointer;
  height: 24px;
  line-height: 24px;
  background: #e9eaec;
  border-radius: 4px 4px 4px 4px;
  color: #4e5469;
  padding: 0 10px;
  font-size: 12px;
  margin-left: 5px;
  margin-top: 7px;
  &:first-of-type {
    margin-left: 0;
  }
  &.active {
    background-color: #fff;
    color: #236dff;
    border-color: #fff;
    &::before {
      content: '';
      background: #236dff;
      display: inline-block;
      width: 6px;
      height: 6px;
      border-radius: 50%;
      position: relative;
      margin-right: 2px;
    }
  }
}
.contextmenu {
  margin: 0;
  background: #fff;
  z-index: 3000;
  position: absolute;
  list-style-type: none;
  padding: 5px 0;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 400;
  color: #333;
  box-shadow: 2px 2px 3px 0 rgba(0, 0, 0, 0.3);
  li {
    margin: 0;
    padding: 7px 16px;
    cursor: pointer;
    &:hover {
      background: #eee;
    }
  }
}
</style>