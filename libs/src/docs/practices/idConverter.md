# 生成字符串的唯一标识

<DemoBlock src="practices/idConverter.ts" >

<template #demo>

```ts
const existedMap = new Map()

// 用于检查重复的邀请码, 支持1千万用户
for (let i = 0; i <= 100; i++) {
  // 生成邀请码
  const userId = i
  const inviteCode = InviteCodeGenerator.generateInviteCode(userId)
  if (existedMap.has(inviteCode)) {
    console.log(`重复的邀请码: ${inviteCode} userId: ${userId}`)
    throw new Error('重复的邀请码')
  } else {
    existedMap.set(inviteCode, userId)
    console.log(`生成的邀请码: ${inviteCode}`)
  }
}

for (const key of existedMap.keys()) {
  const inviteCode = key
  const userId = existedMap.get(inviteCode)
  // 解析邀请码
  const parsedUserId = InviteCodeGenerator.parseUserId(inviteCode)
  console.log(`解析出的用户ID: ${parsedUserId}`)
  if (parsedUserId !== userId) {
    throw new Error('解析出的用户ID不正确')
  }
}


```

</template>

</DemoBlock >

