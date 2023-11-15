const cryptoJS = require('crypto-js')

export default {
  /**
   * 生成aes256秘钥
   * @returns string aes key
   */
  getKey() {
    // 生成随机key
    var randomKeyString = ''
    var dict = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
    while (randomKeyString.length < 32) {
      randomKeyString += dict[Math.floor(Math.random() * dict.length)]
    }
    var key = cryptoJS.enc.Utf8.parse(randomKeyString)
    return key
  },

  /**
   * 根据秘钥加密内容
   * @param {*} key
   * @param {*} content
   * @returns
   */
  encrypt(key, context) {
    // 根据key设置内容
    return cryptoJS.AES.encrypt(context, key, {
      mode: cryptoJS.mode.ECB,
      padding: cryptoJS.pad.Pkcs7
    }).ciphertext.toString()
  }
}
