const getters = {
  userInfo: state => state.user.userInfo,
  permissions: state => state.user.permissions,
  roles: state => state.user.roles,
  avatar: state => state.user.userInfo.avatar,
}
export default getters
