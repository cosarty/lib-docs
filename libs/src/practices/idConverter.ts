// 定义base62字符集
const BASE62 = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'
const BASE = 62
const CODE_LENGTH = 6

const offset = 100000000
const prime = 7364737

export class InviteCodeGenerator {
  // 添加一个随机偏移量，增加随机性
  private static readonly OFFSET = offset
  // 用于混淆的质数，与BASE62互质
  private static readonly PRIME = prime

  /**
   * 根据用户ID生成邀请码
   * @param userId 用户ID
   * @returns 6位邀请码
   */
  static generateInviteCode(userId: number): string {
    if (userId < 0 || userId >= offset) {
      throw new Error('User ID must be between 0 and 100000000')
    }

    // 添加偏移量并进行混淆运算
    const mixedNumber = ((userId + this.OFFSET) * this.PRIME) % offset

    // 转换为base62
    return this.toBase62(mixedNumber).padStart(CODE_LENGTH, '0')
  }

  /**
   * 从邀请码解析出用户ID
   * @param inviteCode 6位邀请码
   * @returns 用户ID
   */
  static parseUserId(inviteCode: string): number {
    if (!this.isValidInviteCode(inviteCode)) {
      throw new Error('Invalid invite code format')
    }

    // 将base62转回数字
    const mixedNumber = this.fromBase62(inviteCode)

    // 反向计算得到原始用户ID
    // 计算模逆元
    const modInverse = this.modInverse(this.PRIME, offset)
    const userId =
      (((mixedNumber * modInverse) % offset) - this.OFFSET + offset) % offset

    return userId
  }

  /**
   * 验证邀请码格式是否正确
   * @param code 待验证的邀请码
   * @returns boolean
   */
  static isValidInviteCode(code: string): boolean {
    if (code.length !== CODE_LENGTH) return false
    return code.split('').every(char => BASE62.includes(char))
  }

  /**
   * 将数字转换为base62字符串
   * @param num 待转换的数字
   * @returns base62字符串
   */
  private static toBase62(num: number): string {
    let result = ''
    let value = num

    while (value > 0) {
      result = BASE62[value % BASE] + result
      value = Math.floor(value / BASE)
    }

    return result || '0'
  }

  /**
   * 将base62字符串转换回数字
   * @param str base62字符串
   * @returns 转换后的数字
   */
  private static fromBase62(str: string): number {
    return str.split('').reduce((acc, char) => {
      return acc * BASE + BASE62.indexOf(char)
    }, 0)
  }

  /**
   * 计算模逆元 (用于解码)
   * @param a 待求逆元的数
   * @param m 模数
   * @returns 模逆元
   */
  private static modInverse(a: number, m: number): number {
    let [old_r, r] = [a, m]
    let [old_s, s] = [1, 0]

    while (r !== 0) {
      const quotient = Math.floor(old_r / r)
      ;[old_r, r] = [r, old_r - quotient * r]
      ;[old_s, s] = [s, old_s - quotient * s]
    }

    return (old_s + m) % m
  }
}

