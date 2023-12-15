const getters = {
  menuList: state => state.system.menuList,
  userInfo: state => state.system.userInfo,
  cachedViews: state => state.system.cachedViews,
  sidebarRouters: state => state.system.sidebarRouters,
  permissions: state => state.system.permissions,
  roles: state => state.system.roles,
  currentPath: state => state.system.currentPath,
  name: state => '约纽科技'
}
export default getters
