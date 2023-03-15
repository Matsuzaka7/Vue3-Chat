<template>
  <div class="auxiliary">
    <div>
      <!-- 选择图片 -->
      <input id="upload-img" type="file" @change="uploadImg" accept="image/*">
      <label for="upload-img"><i class="iconfont icon-tupian"></i></label>
    </div>
    <div>
      <!-- 选择文件 -->
      <input id="upload-file" type="file" @change="uploadFile">
      <label for="upload-file"><i class="iconfont icon-wenjianjia"></i></label>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ElMessageBox, ElMessage } from 'element-plus'
import { compressPicture } from '@/utils/picture'
import { scrollBottom } from '@/utils/chat'
import { uploadImageBase64, uploadFormFile } from '@/api/ChatApi'
import { uploadImageBase64Type } from '@/types/chatApiType';

const props = defineProps(['carriedIP'])

const userName = localStorage.getItem('userName') || ''

// 上传图片
const uploadImg = (e) => {
  const { type } = e.target.files[0]
  if (!type.includes('image')) {
    ElMessage({
      type: 'error',
      message: '仅支持图片格式哦',
    })
    return
  }

  const readObj = new FileReader()
  readObj.onload = () => {
    compressPicture(readObj.result as string, 70, 'image/jpeg', (data: uploadImageBase64Type) => {
      ElMessageBox.confirm('确认发送该图片吗？', '确认',
        {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          center: true,
          customClass: 'custom'
        }
      ).then(() => {
        uploadImageBase64(userName, data, props.carriedIP).then(({ data }) => {
          if (data.data) {
            ElMessage({ type: 'success', message: '已发送！' })
            setTimeout(() => scrollBottom(), 300);
          } else {
            ElMessage({
              type: 'warning',
              message: '发送失败..',
            })
          }
        })
      }).catch(() => {
        ElMessage({
          type: 'info',
          message: '已取消',
        })
      })
    })
  }
  readObj.readAsDataURL(e.target.files[0])
}

// 上传文件
const uploadFile = (e) => {
  const fileObj = e.target.files[0]
  // 最大 100m
  const maxFileSize = 100 * 1024 * 1024
  if (fileObj.size > maxFileSize) {
    ElMessage({ type: 'warning', message: `所选文件不能大于${maxFileSize / 1024 / 1024}M` })
    return void 0;
  }
  ElMessageBox.confirm('确认发送该文件吗？', '确认',
    {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      center: true,
      customClass: 'custom'
    }
  ).then(() => {
    ElMessage({ type: 'info', message: '发送中..' })
    uploadFormFile(userName, fileObj, props.carriedIP)
      .then(({ data }) => {
        if (data.type === "saveFile" && data.data === true) {
          ElMessage({ type: 'success', message: '已发送！' })
        }
      })
      .catch(err => {
        ElMessage({ type: 'error', message: '意外错误：' + err.message })
      })
  }).catch(() => {
    ElMessage({
      type: 'info',
      message: '已取消',
    })
  })
}
</script>

<style lang="scss" scoped>
.icon-tupian,
.icon-wenjianjia {
  color: #666;
  font-size: 1.2em;
}

// 隐藏input
#upload-img,
#upload-file {
  display: none;
}

// 发送图片/文件
.auxiliary {
  border-top: 1px solid #efefef;
  padding-top: 3px;
  padding-left: 5px;
  margin-bottom: 3px;
  display: flex;

  &>div {
    margin: 0 5px 0 5px;
  }
}
</style>