const getters = {
  userInfo: state => state.user.userInfo,
  permissions: state => state.system.permissions,
  roles: state => state.system.roles
}
export default getters
