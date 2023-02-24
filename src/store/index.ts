import { defineStore } from "pinia";

interface IndexState {
  ws: WebSocket,
  wsLink: boolean,
  userIP: string,
  notice: string,
  wsData: Record<string, any>,
  username: string,
  chatState: number,
}

export default defineStore('index', {
  state: (): IndexState => {
    return {
      // ws链接对象
      ws: {},
      // 是否连接成功
      wsLink: false,
      // 用户ip
      userIP: '',
      // 底部公告栏
      notice: '是否存在',
      // 名单列表数据
      wsData: {},
      // 用户名称
      username: '',
      // 当前是群聊(0)还是私聊(1)
      chatState: 0
    }
  },
  actions: {
    // 设置ws
    setWs (data: {}) {
      this.ws = data
    },
    // 修改是否连接成功
    setWsLink(data: boolean) {
      this.wsLink = data
    },
    setWsData(data: []) {
      this.wsData = data
    },
    setUserName(data: string) {
      this.username = data
    },
    setUserIP(data: string) {
      this.userIP = data
    },
    setNotice(data: string) {
      this.notice = data
    },
    /**
     * 修改状态
     * @param data 0：群聊 1：私聊
     */
    setChatState(data: number) {
      this.chatState = data
    }
  }
})
