/** 
 * 加载更多数据 
 * @param page 页数
 * @param limit 条数
 */
export type loadMoreInfoType = {
  page: number,
  limit: number
}

/** 
 * 图片压缩类型对象
 * @param imageWidth 图片宽度
 * @param imageHeight 图片高度
 * @param compressPic 图片base64编码字符串
 */
export type uploadImageBase64Type = {
  imageWidth: number,
  imageHeight: number,
  compressPic: string
}