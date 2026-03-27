import { createHash, createDecipheriv } from 'crypto'

export function verifyPassword(
  input: string,
  stored: string,
  encryptionType: string
): boolean {
  switch (encryptionType) {
    case 'MD5': {
      const hashed = createHash('md5').update(input).digest('hex').toUpperCase()
      return hashed === stored.toUpperCase()
    }
    case 'AES': {
      try {
        const key = Buffer.from('LiveWorx1234567890123456', 'utf8')
        const iv = Buffer.alloc(16, 0)
        const decipher = createDecipheriv('aes-256-cbc', key, iv)
        let decrypted = decipher.update(stored, 'base64', 'utf8')
        decrypted += decipher.final('utf8')
        return decrypted === input
      } catch {
        return false
      }
    }
    default:
      return input === stored
  }
}
