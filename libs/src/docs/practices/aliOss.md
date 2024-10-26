# oss 最佳实践

封装一个操作 oss 的最佳实践

<DemoBlock src="practices/ossClient.ts" >

<template #demo>

```ts
import OssClient from './ossClient.ts'

const multipartUploadClient = await new OssClient()
const res = await multipartUploadClient.multipartUpload(
  `url/filename`,
  file,
  (percent: number) => {
    // 获取进度条的方法
  },
)

await multipartUploadClient.abortMultipartUpload()

if (multipartUploadClient.isAbort) {
  throw new Error('取消成功')
}
```

</template>

</DemoBlock >

