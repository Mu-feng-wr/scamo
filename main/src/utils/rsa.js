import JSEncrypt from 'jsencrypt'
import AES from './aes.js'
import { getSecretKey } from '@/api/system.js'

export default {
  encrypt(context) {
    // 根据key加密内容
    const RSA = new JSEncrypt()
    return new Promise((resolve, reject) => {
      getSecretKey()
        .then((res) => {
          RSA.setPublicKey(res.data.publicKey)
          const aesKey = AES.getKey()
          const secretContext = RSA.encrypt(aesKey.toString())
          const result = {
            headerParam: {
              'Secret-Key-Id': res.data.secretKeyId,
              'Secret-Context': secretContext
            },
            encryptContext: AES.encrypt(aesKey, context)
          }
          resolve(result)
        })
        .catch((error) => {
          reject(error)
        })
    })
  }
}
