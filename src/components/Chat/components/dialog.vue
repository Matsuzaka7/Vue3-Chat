<template>
  <ElDialog class="Dialog" 
    width="80%" 
    v-model="isShowDialog" 
    title="初次到来是否给自己起个名字？" 
    :close-on-click-modal="false"
    :close-on-press-escape="false" 
    :show-close="false"
  >
    <input class="userNameInput" v-model="userName" type="text" placeholder="请输入用户名">
    <div class="buttonBox">
      <button @click="onCal">取消</button>
      <button @click="onOk">确认</button>
    </div>
  </ElDialog>
</template>

<script setup lang="ts">
import { Ref, ref, watch } from 'vue'
import { ElMessage, ElDialog, ElMessageBox } from 'element-plus'
import { setUserName } from '@/api/ChatApi'
const props = defineProps({
  isShowDialog: {
    type: Boolean,
    default: false
  }
})

// 组件挂载完毕后出现是否自定义用户名
const userName: Ref<string> = ref('')
const isShowDialog: Ref<boolean> = ref(false)

watch(() => props.isShowDialog, (newValue) => {
  isShowDialog.value = newValue
})

// 确认输入用户名
const onOk = () => {
  if (!userName.value.trim()) {
    ElMessage('用户名不能为空哦~')
    return
  }
  if (userName.value.trim().length > 6) {
    ElMessage('用户名字数不能大于6位')
    return
  }

  ElMessageBox.confirm(`是否设置用户名为：${userName.value}？确认后不可更改哦~`, '提示', { confirmButtonText: '确认', cancelButtonText: '再想想', type: 'warning', customClass: 'custom' })
    .then(() => {
      // 将用户名发送给服务器
      setUserName(userName.value)
        .then(({ data }) => {
          if (data.type === 'err') {

          } else if (data.type === 'rejectUserName') {
            ElMessage({ type: 'warning', message: '名称已重复' })
          } else if (data.type === 'succeedUserName') {
            isShowDialog.value = false
            localStorage.setItem('userName', userName.value)
            ElMessage({ type: 'success', message: '成功' })
          }
        })
        .catch(e => {
          console.log('err', e);
        })
    })
}

// 取消输入用户名
const onCal = () => {
  ElMessageBox.confirm(`不想输入用户名？`, '提示', { confirmButtonText: '确认', cancelButtonText: '再想想', type: 'warning', customClass: 'custom' })
    .then(() => {
      isShowDialog.value = false
    })
}
</script>

<style lang="scss" scoped>
.buttonBox {
  margin: 1.6vh 15px 0;
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  &>button {
    border: none;
    padding: 1.2vh 3vh;
    border-radius: 6px;
  }
}

.userNameInput {
  border: none;
  width: 100%;
  height: 4.2vh;
  background-color: #efefef;
  padding-left: 12px;
  margin-top: -20px;
}
</style>