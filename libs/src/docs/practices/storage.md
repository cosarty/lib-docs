# Storage

封装一个高可用的 localStorage 的操作方式，支持`过期时间`的设置


<DemoBlock src="practices/storage.ts" >

<template #demo>

```js
import createStorage from './storage'

type StorageKeyType = {
  userInfo: {
    nickName: string;
  };
};

const storage = createStorage<StorageKeyType>();
storage.userInfo.set({ nickName: 'cosarty' }, 3000); // 设置
const { nickName } = storage.userInfo.get({ nickName: '' })!; // 获取
console.log('nickName: ', nickName);
storage.userInfo.remove(); // 移除

```

</template>

</DemoBlock >
