import * as crypto from 'crypto';

/**
 * 密钥生成器配置接口
 */
interface ApiKeyGeneratorConfig {
  version?: number;              // 密钥版本号
  userIdLength?: number;         // 用户ID部分长度
  randomPartLength?: number;     // 随机部分长度
  checksumLength?: number;       // 校验和长度
  timestampPrecision?: number;   // 时间戳精度（位数）
  permissionBits?: number;       // 权限位数
  encryptionRounds?: number;     // 加密轮数
  defaultExpiryDays?: number | null; // 默认过期天数，null表示永不过期
}

/**
 * 权限类型
 */
type Permission = 'read' | 'write' | 'delete' | 'admin' | 'execute' | 'export' | 'import' | 'special';

/**
 * 验证结果接口
 */
interface VerificationResult {
  isValid: boolean;
  version?: number;
  userIdPart?: string;
  randomPart?: string;
  permissions?: Permission[];
  createdAt?: Date;
  expiresAt?: Date | null;  // null表示永不过期
  reason?: string;
}

/**
 * 高级API密钥生成器
 * 支持：多层加密、版本控制、权限编码、时间戳编码、可选过期时间
 */
class ApiKeyGenerator {
  private masterKey: string;
  private secondaryKey: string;
  private config: Required<ApiKeyGeneratorConfig>;
  private charset: string;
  
  // 权限映射
  private readonly permissionMap: Record<Permission, number> = {
    'read': 0x01,
    'write': 0x02,
    'delete': 0x04,
    'admin': 0x08,
    'execute': 0x10,
    'export': 0x20,
    'import': 0x40,
    'special': 0x80
  };
  
  constructor(masterKey: string, secondaryKey: string, options: ApiKeyGeneratorConfig = {}) {
    this.masterKey = masterKey;
    this.secondaryKey = secondaryKey;
    
    // 配置项与默认值
    this.config = {
      version: options.version ?? 1,
      userIdLength: options.userIdLength ?? 12,
      randomPartLength: options.randomPartLength ?? 16,
      checksumLength: options.checksumLength ?? 10,
      timestampPrecision: options.timestampPrecision ?? 6,
      permissionBits: options.permissionBits ?? 8,
      encryptionRounds: options.encryptionRounds ?? 3,
      defaultExpiryDays: options.defaultExpiryDays ?? null  // 默认为永不过期
    };
    
    // 字符集配置
    this.charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  }
  
  /**
   * 生成API密钥
   * @param userId - 用户的唯一标识
   * @param permissions - 权限数组
   * @param expiryDays - 过期天数，null表示永不过期，未指定则使用默认配置
   * @returns 生成的API密钥
   */
  generateKey(
    userId: string, 
    permissions: Permission[] = [], 
    expiryDays?: number | null
  ): string {
    // 确定实际使用的过期天数
    const actualExpiryDays = expiryDays !== undefined ? expiryDays : this.config.defaultExpiryDays;
    
    // 1. 编码权限位图
    const permissionsBitmap = this.encodePermissions(permissions);
    
    // 2. 获取当前时间戳并编码
    const timestamp = this.encodeTimestamp();
    
    // 3. 编码过期标记 (1表示有过期时间，0表示永不过期)
    const hasExpiry = actualExpiryDays !== null ? '1' : '0';
    
    // 4. 编码过期天数 (只有当hasExpiry为1时才有意义)
    const expiryDaysEncoded = actualExpiryDays !== null 
      ? this.encodeNumber(actualExpiryDays, 3)  // 支持最多3位数的天数(~999天)
      : '000';  // 占位，但不使用
    
    // 5. 处理用户ID（多轮HMAC加密）
    const userIdPart = this.multiLayerHash(userId, this.config.encryptionRounds, this.config.userIdLength);
    
    // 6. 生成随机部分
    const randomBytes = crypto.randomBytes(32);
    const randomPart = this.formatToCharset(randomBytes.toString('hex'), this.config.randomPartLength);
    
    // 7. 构建基础字符串
    const versionByte = this.encodeNumber(this.config.version, 2);
    const baseString = `${versionByte}${userIdPart}${randomPart}${permissionsBitmap}${timestamp}${hasExpiry}${expiryDaysEncoded}`;
    
    // 8. 计算校验和
    const checksum = this.computeChecksum(baseString, this.config.checksumLength);
    
    // 9. 完整密钥
    const fullKey = `${baseString}${checksum}`;
    
    // 10. 混淆处理
    return this.obfuscate(fullKey);
  }
  
  /**
   * 验证API密钥
   * @param apiKey - 要验证的API密钥
   * @returns 验证结果
   */
  verifyKey(apiKey: string): VerificationResult | null {
    try {
      // 1. 解混淆
      const deobfuscatedKey = this.deobfuscate(apiKey);
      
      // 2. 计算预期的总长度
      const permissionBitmapLength = Math.ceil(this.config.permissionBits / 4);
      const expiryInfoLength = 1 + 3; // 1位过期标记 + 3位过期天数
      const expectedLength = 2 + this.config.userIdLength + this.config.randomPartLength + 
                            permissionBitmapLength + this.config.timestampPrecision + 
                            expiryInfoLength + this.config.checksumLength;
      
      if (deobfuscatedKey.length !== expectedLength) {
        console.log(`长度不匹配: 期望 ${expectedLength}, 实际 ${deobfuscatedKey.length}`);
        return null;
      }
      
      // 3. 提取各个部分
      let currentPos = 0;
      
      const versionByte = deobfuscatedKey.substring(currentPos, currentPos + 2);
      const version = this.decodeNumber(versionByte);
      currentPos += 2;
      
      const userIdPart = deobfuscatedKey.substring(currentPos, currentPos + this.config.userIdLength);
      currentPos += this.config.userIdLength;
      
      const randomPart = deobfuscatedKey.substring(currentPos, currentPos + this.config.randomPartLength);
      currentPos += this.config.randomPartLength;
      
      const permissionsBitmap = deobfuscatedKey.substring(currentPos, currentPos + permissionBitmapLength);
      currentPos += permissionBitmapLength;
      
      const timestamp = deobfuscatedKey.substring(currentPos, currentPos + this.config.timestampPrecision);
      currentPos += this.config.timestampPrecision;
      
      const hasExpiry = deobfuscatedKey.substring(currentPos, currentPos + 1) === '1';
      currentPos += 1;
      
      const expiryDaysEncoded = deobfuscatedKey.substring(currentPos, currentPos + 3);
      const expiryDays = hasExpiry ? this.decodeNumber(expiryDaysEncoded) : null;
      currentPos += 3;
      
      const providedChecksum = deobfuscatedKey.substring(currentPos);
      
      // 4. 重新计算校验和
      const baseString = deobfuscatedKey.substring(0, deobfuscatedKey.length - this.config.checksumLength);
      const calculatedChecksum = this.computeChecksum(baseString, this.config.checksumLength);
      
      // 5. 校验和验证
      if (calculatedChecksum !== providedChecksum) {
        console.log('校验和不匹配:', { 
          provided: providedChecksum, 
          calculated: calculatedChecksum 
        });
        return null;
      }
      
      // 6. 解码时间戳
      const decodedTimestamp = this.decodeTimestamp(timestamp);
      const createdAt = new Date(decodedTimestamp * 1000);
      
      // 7. 计算过期时间(如果有)
      let expiresAt: Date | null = null;
      if (hasExpiry && expiryDays !== null) {
        expiresAt = new Date(decodedTimestamp * 1000 + expiryDays * 24 * 60 * 60 * 1000);
        
        // 8. 验证是否过期
        if (expiresAt < new Date()) {
          return { 
            isValid: false, 
            reason: 'expired',
            version,
            userIdPart,
            createdAt,
            expiresAt
          };
        }
      }
      
      // 9. 解码权限
      const permissions = this.decodePermissions(permissionsBitmap);
      
      // 10. 返回验证结果
      return {
        isValid: true,
        version,
        userIdPart,
        randomPart,
        permissions,
        createdAt,
        expiresAt
      };
    } catch (error) {
      console.error('密钥验证失败:', error);
      return null;
    }
  }
  
  /**
   * 多层哈希计算
   * @private
   */
  private multiLayerHash(input: string, rounds: number, length: number): string {
    let result = input;
    // 使用不同的盐进行多轮哈希
    for (let i = 0; i < rounds; i++) {
      const salt = `${this.masterKey}${i}${this.secondaryKey}`;
      result = crypto
        .createHmac('sha256', salt)
        .update(result)
        .digest('hex');
    }
    
    return this.formatToCharset(result, length);
  }
  
  /**
   * 计算校验和
   * @private
   */
  private computeChecksum(input: string, length: number): string {
    // 使用两个密钥组合生成校验和
    const combinedKey = this.masterKey + this.secondaryKey;
    const hmac = crypto
      .createHmac('sha256', combinedKey)
      .update(input)
      .digest('hex');
    
    return this.formatToCharset(hmac, length);
  }
  
  /**
   * 编码权限为位图
   * @private
   */
  private encodePermissions(permissions: Permission[]): string {
    // 计算权限位图
    let bitmap = 0;
    permissions.forEach(perm => {
      if (this.permissionMap[perm]) {
        bitmap |= this.permissionMap[perm];
      }
    });
    
    // 转为十六进制字符串
    return bitmap.toString(16).padStart(Math.ceil(this.config.permissionBits / 4), '0');
  }
  
  /**
   * 解码权限位图
   * @private
   */
  private decodePermissions(bitmap: string): Permission[] {
    const value = parseInt(bitmap, 16);
    const permissions: Permission[] = [];
    
    (Object.entries(this.permissionMap) as [Permission, number][]).forEach(([perm, bit]) => {
      if ((value & bit) !== 0) {
        permissions.push(perm);
      }
    });
    
    return permissions;
  }
  
  /**
   * 编码时间戳
   * @private
   */
  private encodeTimestamp(): string {
    // 获取当前Unix时间戳
    const timestamp = Math.floor(Date.now() / 1000);
    // 转为Base36编码（更紧凑的表示）
    return timestamp.toString(36).padStart(this.config.timestampPrecision, '0');
  }
  
  /**
   * 解码时间戳
   * @private
   */
  private decodeTimestamp(encoded: string): number {
    return parseInt(encoded, 36);
  }
  
  /**
   * 将数字编码为自定义字符集
   * @private
   */
  private encodeNumber(num: number, length: number): string {
    const result: string[] = [];
    const base = this.charset.length;
    
    let remainder = num;
    while (remainder > 0 || result.length < length) {
      const char = this.charset[remainder % base] || '';
      result.unshift(char);
      remainder = Math.floor(remainder / base);
      
      if (result.length >= length) break;
    }
    
    // 填充到指定长度
    while (result.length < length) {
      result.unshift(this.charset[0] || '');
    }
    
    return result.join('');
  }
  
  /**
   * 解码自定义字符集的数字
   * @private
   */
  private decodeNumber(encoded: string): number {
    const base = this.charset.length;
    let result = 0;
    
    for (let i = 0; i < encoded.length; i++) {
      const char = encoded[i];
      const value = this.charset.indexOf(char || '');
      if (value === -1) {
        throw new Error(`无效的字符: ${char}`);
      }
      result = result * base + value;
    }
    
    return result;
  }
  
  /**
   * 格式化字符串以适应指定字符集
   * @private
   */
  private formatToCharset(input: string, length: number): string {
    const result: string[] = [];
    
    // 使用输入的哈希值生成符合字符集的输出
    for (let i = 0; i < length; i++) {
      // 取两个字符作为一个16位数
      const pos = (i * 2) % (input.length - 1);
      const hexPair = input.substring(pos, pos + 2);
      const value = parseInt(hexPair, 16);
      
      // 映射到字符集
      result.push(this.charset[value % this.charset.length] || '');
    }
    
    return result.join('');
  }
  
  /**
   * 混淆处理（简化且可靠的可逆变换）
   * @private
   */
  private obfuscate(input: string): string {
    // 创建一个混淆用的密钥，长度与输入相同
    const keyBytes = crypto.createHash('sha256')
      .update(this.masterKey + this.secondaryKey)
      .digest();
    
    let obfuscationKey = '';
    while (obfuscationKey.length < input.length) {
      obfuscationKey += keyBytes.toString('hex');
    }
    obfuscationKey = obfuscationKey.substring(0, input.length);
    
    const result: string[] = [];
    for (let i = 0; i < input.length; i++) {
      const inputChar = input.charAt(i);
      const keyChar = obfuscationKey.charAt(i);
      
      // 获取字符在字符集中的索引
      const inputIndex = this.charset.indexOf(inputChar);
      if (inputIndex === -1) {
        throw new Error(`无效的输入字符: ${inputChar}`);
      }
      
      const keyValue = parseInt(keyChar, 16) || 0;
      
      // 应用简单的偏移（确保结果仍在字符集范围内）
      const newIndex = (inputIndex + keyValue) % this.charset.length;
      result.push(this.charset.charAt(newIndex));
    }
    
    return result.join('');
  }
  
  /**
   * 解混淆处理
   * @private
   */
  private deobfuscate(input: string): string {
    // 创建一个混淆用的密钥，长度与输入相同
    const keyBytes = crypto.createHash('sha256')
      .update(this.masterKey + this.secondaryKey)
      .digest();
    
    let obfuscationKey = '';
    while (obfuscationKey.length < input.length) {
      obfuscationKey += keyBytes.toString('hex');
    }
    obfuscationKey = obfuscationKey.substring(0, input.length);
    
    const result: string[] = [];
    for (let i = 0; i < input.length; i++) {
      const inputChar = input.charAt(i);
      const keyChar = obfuscationKey.charAt(i);
      
      // 获取字符在字符集中的索引
      const inputIndex = this.charset.indexOf(inputChar);
      if (inputIndex === -1) {
        throw new Error(`无效的输入字符: ${inputChar}`);
      }
      
      const keyValue = parseInt(keyChar, 16) || 0;
      
      // 反向应用偏移（确保结果为正）
      let newIndex = (inputIndex - keyValue) % this.charset.length;
      if (newIndex < 0) newIndex += this.charset.length;
      
      result.push(this.charset.charAt(newIndex));
    }
    
    return result.join('');
  }
}
