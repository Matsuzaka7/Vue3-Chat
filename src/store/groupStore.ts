import { setUserName } from "../api/ChatApi";
import { defineStore } from "pinia";
export default defineStore("groupData", {
  // state必须是一个函数, 函数中返回一个对象
  state: () => {
    return {
      // 群聊数据
      groupInfoData: [],
    }
  },
  // 类似于计算属性, 有缓存
  getters: {},
  actions: {
    // 添加数据
    addGroupInfoData(data: {}) {
      this.groupInfoData.push(data);
    },
    // 设置群聊数据（初次）
    setGroupInfoData(data: {}) {
      this.groupInfoData = data;
    },
  },
});
