const { defineConfig } = require('@vue/cli-service')
const VUE_APP_BASE_API=''
module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    open: true,
    client: {
      overlay: {
        warnings: false,
        errors: true
      }
    },
    proxy: {
      [VUE_APP_BASE_API]: {
        target: 'http://39.105.130.133:31886/',
        changeOrigin: true,
        pathRewrite: {
          ['^' + VUE_APP_BASE_API]: ''
        }
      }
    },
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "*",
      "Access-Control-Allow-Methods": "*",
    },
  },
})
