import Cookies from 'js-cookie'

const TokenKey = 'vue_admin_template_token'

export function getDupToken() {
  return Cookies.get('dupToken')
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}
