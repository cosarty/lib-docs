import dayjs from 'dayjs'
import OSS from 'ali-oss'
import { ElNotification, ElMessage } from 'element-plus'

class OssClent {
  static client?: OSS
  static expiration: string | undefined
  abortCheckpoint: any
  isAbort = false
  constructor() {
    //单例模式
    // 初始化oss客户端:若当前客户端不存在则新建
    if (!OssClent.client) {
      return this.initClinet() as any
    }

    return this
  }

  //销毁当前客户端
  static removeClinet = () => {
    OssClent.client = undefined
  }

  //初始化当客户端
  async initClinet() {
    try {
      // 获取key    getOssKey():获取当前阿里云所需上传信息
      // const res = await getOssKey()
      const res = {} as any
      const data = res.data
      OssClent.expiration = data.expiration || undefined
      OssClent.client = this.getClient(data)
      return this
    } catch {
      ElNotification({
        title: 'OSS服务初始化失败',
        message: '请刷新重试',
        type: 'error',
      })
      return this
    }
  }
  getClient(options: any) {
    const { accessKeyId, accessKeySecret, securityToken } = options
    const client = new OSS({
      // yourRegion填写Bucket所在地域。以华东1（杭州）为例，Region填写为oss-cn-hangzhou。
      region: 'oss-cn-beijing',
      // 从STS服务获取的临时访问密钥（AccessKey ID和AccessKey Secret）。
      accessKeyId,
      accessKeySecret,
      // 从STS服务获取的安全令牌（SecurityToken）。
      stsToken: securityToken,
      refreshSTSToken: async () => {
        // 向您搭建的STS服务获取临时访问凭证。
        // const info = await getOssKey()
        const info = {} as any
        OssClent.expiration = info.data.expiration || undefined
        const { accessKeyId, accessKeySecret, securityToken } = info.data
        return {
          accessKeyId,
          accessKeySecret,
          stsToken: securityToken,
        }
      },
      // 刷新临时访问凭证的时间间隔，单位为毫秒。每隔一段时间定时器会自动掉后台接口刷新token
      refreshSTSTokenInterval: 900000,
      // 填写Bucket名称。
      bucket: 'baijing-gtc',
    })

    return client
  }

  isNotPass() {
    if (!OssClent.client) {
      return true
    }
    // 判断当前的key是否过期
    return dayjs(OssClent.expiration).isAfter(new Date())
  }

  // 异常处理
  async tryUpload(
    methods: 'put' | 'multipartUpload',
    pathname: string,
    file: File,
    options: any,
    tryNum = 0,
    orginName = pathname,
  ): Promise<OSS.PutObjectResult | OSS.MultipartUploadResult | undefined> {
    if (this.isNotPass()) {
      await this.initClinet()
    }
    OssClent.client?.put
    try {
      return await OssClent.client![methods](`${pathname}`, file, options)
    } catch (e: any) {
      if (e.status === 409) {
        // 如果文件名字重复就重新命名
        const uploadName = orginName.replace(
          /\.[a-zA-Z0-9]+$/,
          word => `(${++tryNum})${word}`,
        )
        return this.tryUpload(
          methods,
          uploadName,
          file,
          options,
          tryNum,
          orginName,
        )
      } else if (e.name === 'cancel') {
        return
      } else {
        // 如果没有错误就直接返回
        if (!e) return

        throw new Error('上传失败')
      }
    }
  }
  // 单次上传
  async put(pathname: string, file: File) {
    return this.tryUpload('put', pathname, file, {
      headers: {
        'x-oss-forbid-overwrite': true,
      },
    })
  }
  // 分片上传
  async multipartUpload(
    pathname: string,
    file: File,
    percentCallBack?: (percent: number) => void,
  ) {
    return this.tryUpload('multipartUpload', pathname, file, {
      headers: {
        'x-oss-forbid-overwrite': true,
      },
      // 进度条的配置项
      progress: async (p: number, cpt: any) => {
        // 获取进度条的值
        this.abortCheckpoint = cpt //取消时需要的参数
        if (this.isAbort) {
          // 终端上传
          try {
            await this.abortMultipartUpload()
            ElMessage.success('取消成功')
          } catch (error) {
            ElMessage.error('取消失败')
          }
          return
        }
        percentCallBack?.(Number((p * 100).toFixed(0)))
      },
      // 每传输完一个分片 进度条会走一个百分比 不设置的话由于partsize过大 可能导致很长时间进度条都看不到效果
      partSize: 1024 * 1024 * 10, // 指定上传的每个分片的大小，范围为100 KB~5 GB。单个分片默认大小为1 * 1024 * 1024（即1 MB）
      // 设置并发上传的分片数量。
      parallel: 2,
    })
  }
  // 中断分片上传
  async abortMultipartUpload() {
    const res = await OssClent.client!.abortMultipartUpload(
      this.abortCheckpoint.name,
      this.abortCheckpoint.uploadId,
    )

    this.abortCheckpoint = undefined

    return res
  }
  // 下载文件
  async signatureUrl(fileName: string, ossUrl: string) {
    const response = {
      'content-disposition': `attachment; filename=${encodeURIComponent(
        fileName,
      )}`,
    }
    return await OssClent.client!.signatureUrl(ossUrl, { response })
  }
}

export default OssClent

