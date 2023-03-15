import { h } from 'vue'
import { defineStore } from "pinia"
import { storeType, actionType } from "@/types/storeType"
import { ElMessage, ElNotification } from 'element-plus'
import { getUserName } from '@/api/ChatApi'
import { base64ToUtf8 } from '@/utils/chat'

export default defineStore({
  id: "index",
  state: (): storeType => {
    return {
      wsData: {
        ws: null,
        wsLink: false,
        userIP: "",
        notice: "是否存在",
        persons: {},
        username: "",
        chatState: 0,
        isShowDialog: false
      },
      groupInfoData: [],
      private: {
        carriedIP: "",
        privateInfoData: [],
        privateMessageList: [],
      },
    };
  },
  actions: {
    setWs(data) {
      this.wsData.ws = data;
    },
    setWsLink(data) {
      this.wsData.wsLink = data;
    },
    setPersons(data) {
      this.wsData.persons = data;
    },
    setUserName(data) {
      this.wsData.username = data;
    },
    setUserIP(data) {
      this.wsData.userIP = data;
    },
    setNotice(data) {
      this.wsData.notice = data;
    },
    setChatState(data) {
      this.wsData.chatState = data;
    },
    setCarriedIP(data) {
      this.private.carriedIP = data;
    },
    addPrivateInfoData(data) {
      this.private.privateInfoData.push(data);
    },
    setPrivateInfoData(data) {
      this.private.privateInfoData = data;
    },
    setPrivateInfoList(data) {
      this.privateMessageList.push(data);
    },
    updatePrivateInfoList(ip, route, cb) {
      const find = this.private.privateMessageList.find(item => item.ip === ip);
      if (route.params?.ip !== ip) {
        if (!find) {
          this.private.privateMessageList.push({
            // 标识是否打开
            isFlag: false,
            ip,
          });
        } else {
          find.isFlag = false;
        }
        ElNotification({
          title: "私聊新消息~",
          message: h("i", { style: "color: teal" }, `${ip}这个b发的`),
          duration: 1800,
          onClick: () => {
            // 修改状态，进入私聊
            this.setChatState(1);
            // 保存正在聊天的用户ip
            this.setCarriedIP(ip);
            cb && cb(ip)
          },
        });
      }
    },
    addGroupInfoData(data) {
      this.groupInfoData.push(data);
    },
    setGroupInfoData(data) {
      this.groupInfoData = data;
    },
    handleGroupAllWs(all, route, router) {
      let { data, type } = JSON.parse(base64ToUtf8(all.data))
      switch (type) {
        case "rejectWs":
          this.wsData.ws.close()
          ElMessage.error('')
          this.setWsLink(false)
          return
        case "personList":
          this.setPersons(data)
          break;
        case "userIP":
          this.setUserIP(data)
          const ipData: any[] = JSON.parse(localStorage.getItem('data')!) || []
          // 如果ip列表中有本次ip则不执行
          if (ipData.includes(data)) return
          const userName = localStorage.getItem('userName')!
          if (userName) {
            getUserName(userName)
            .then(() => {
              this.isShowDialog.value = false
              ElMessage.error('闪死你丫的')
            })
          }
          ipData.push(data)
          localStorage.setItem('data', JSON.stringify(ipData))
          break;
        case "notice":
          this.setNotice(data)
          break;
        case "infoData":
          this.setGroupInfoData(data)
          break;
        case "newInfo":
          this.addGroupInfoData(data)
          break;
        case "findUserName":
          const username: string = localStorage.getItem('userName')! || ''
          !username && localStorage.setItem('userName', data)
          if (data && !localStorage.getItem('userName')) {
            this.isShowDialog.value = true
          } else {
              ElNotification({
                title: '连接成功',
                message: h('i', { style: 'color: teal' }, `欢迎回来 ${username || data}`),
                duration: 3000
              })
          }
          break;
        case "notUser":
          this.isShowDialog.value = true
          break;
        // 以下为私聊的事件
        case "privateNewInfo":
          this.addPrivateInfoData(data)
          this.updatePrivateInfoList(data.userIP, route, (ip) => {
            router.replace({
              name: "privateChat",
              params: {
                ip
              },
            });
          })
          break;
        default:
          ElNotification({
            title: '出现了意外的消息',
            message: h('i', { style: 'color: teal' }, data),
            duration: 5000
          })
          break;
      }
    }
  } as actionType,
});
