import { setUserName } from '../api/ChatApi';
import { defineStore } from "pinia";
export default defineStore('privateData', {
  state: () => {
    return {
      // 当前正在聊天的对象IP
      carriedIP: '',
      // 私聊ws列表
      privateWsList: [],
      // 私聊数据
      privateInfoData: [],
    }
  },
  actions: {
    // 修改正在聊天的人ip
    setCarriedIP(data: string) {
      this.carriedIP = data
    },
    // 私聊数据
    setPrivateInfoData(data: {}) {
      this.privateInfoData.push(data)
    },
    /**
     * 增加私聊ws实例(目标ip, ws实例)
     * @param ip 目标ip
     * @param ws 链接的ws实例
     */
    addPrivateWsList(ip, ws) {
      privateData.push({
        ip, ws
      })
    },
    /**
     * 销毁私聊ws实例(目标ip, ws实例)
     * @param ip 目标ip
     * @param ws 链接的ws实例
     */
    PrivateWsList(ip, ws) {
      const wsList = this.privateWsList
      const findIndex = wsList.findIndex(item => item.ip === ip)
      wsList[findIndex].ws.close()
      if (find) {
        this.privateData.slice(findIndex, 1)
      }
    }
  }
})