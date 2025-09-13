# 构建 API 密钥生成器

<DemoBlock src="practices/apiKeyGenerator.ts" >

<template #demo>

```ts

// 使用示例
const masterKey = '这是一个非常复杂的主密钥，请妥善保管';
const secondaryKey = '这是次级密钥，提供双重安全保障'; 

// 创建密钥生成器实例
const keyGenerator = new ApiKeyGenerator(masterKey, secondaryKey, {
  version: 2,
  encryptionRounds: 3,
  defaultExpiryDays: null  // 默认永不过期
});

// 示例1：生成永不过期的API密钥
const userId = '12345';
const permanentApiKey = keyGenerator.generateKey(userId, ['read', 'write']);
console.log('永不过期的API密钥:', permanentApiKey);

// 验证永不过期的密钥
const permanentKeyVerification = keyGenerator.verifyKey(permanentApiKey);
console.log('永不过期密钥验证结果:', permanentKeyVerification);

// 示例2：生成30天有效期的API密钥
const temporaryApiKey = keyGenerator.generateKey(userId, ['read'], 30);
console.log('30天有效期的API密钥:', temporaryApiKey);

// 验证有过期时间的密钥
const temporaryKeyVerification = keyGenerator.verifyKey(temporaryApiKey);
console.log('有过期时间密钥验证结果:', temporaryKeyVerification);

// 示例3：生成带管理员权限的90天有效期密钥
const adminApiKey = keyGenerator.generateKey(userId, ['read', 'write', 'admin', 'delete'], 90);
console.log('管理员90天有效期API密钥:', adminApiKey);

// 验证管理员密钥
const adminKeyVerification = keyGenerator.verifyKey(adminApiKey);
console.log('管理员密钥验证结果:', adminKeyVerification);

// 尝试验证一个伪造的密钥
try {
  console.log('伪造密钥验证:', keyGenerator.verifyKey('ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890'));
} catch (error) {
  console.error('伪造密钥验证失败:', error);
}

```

</template>

</DemoBlock >

