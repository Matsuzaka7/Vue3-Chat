import { uploadImageBase64Type } from "@/types/chatApiType"
/**
 * 压缩图片
 * @param imageBase64 图片的base64编码
 * @param quality 图片压缩后的质量（0~100）
 * @param mimeType 图片类型
 * @param cb 回调函数, 图片压缩完毕后执行
 */
export const compressPicture = (imageBase64: string, quality: number, mimeType: string, cb: Function) => {
  let canvas = document.createElement('canvas')
  let image = document.createElement('img')
  image.src = imageBase64
  image.onload = e => {
    // 图片压缩后的宽高
    const compressWidth = image.width * 0.8
    const compressHeight = image.height * 0.8
    canvas.width = compressWidth
    canvas.height = compressHeight
    const ctx = canvas.getContext('2d')
    ctx?.drawImage(image, 0, 0, compressWidth, compressHeight)
    const compressPic = canvas.toDataURL(mimeType, quality / 100)
    
    cb({
      imageWidth: canvas.width,
      imageHeight: canvas.height,
      compressPic
    })
  }
}
