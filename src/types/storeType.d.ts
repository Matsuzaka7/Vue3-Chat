import { RouteLocationNormalizedLoaded } from 'vue-router'
export interface storeType {
  /** ws数据对象 */
  wsData: {
    /** ws链接实例对象 */
    ws: WebSocket | null;
    /** ws是否连接成功 */
    wsLink: boolean;
    /** 用户ip */
    userIP: string;
    /** 底部公告栏 */
    notice: string;
    /** 名单列表数据 */
    persons: Record<string, any>;
    /** 用户名称 */
    username: string;
    /** 当前是群聊(0)还是私聊(1) */
    chatState: number;
    /** 是否显示用户名框 */
    isShowDialog: boolean
  };
  /** 群聊数据 */
  groupInfoData: any[];
  /** 私聊数据 */
  private: {
  /** 当前正在聊天的对象IP */
    carriedIP: string;
    /** 私聊数据 */
    privateInfoData: any[];
    /** 私聊人员列表 */
    privateMessageList: any[];
  }
}

export interface actionType {
  /**
   * 设置ws实例
   * @param data webSocket
   */
  setWs: (data: string) => void;
  /**
   * 修改是否连接成功
   * @param data true / false
   */
  setWsLink: (data: boolean) => void;
  /**
   * 设置侧栏人员列表
   * @param data 群聊人员列表数据
   */
  setPersons: (data: []) => void;
  /**
   * 设置我的用户名
   * @param data 用户名
   */
  setUserName: (data: string) => void;
  /**
   * 设置我的ip
   * @param data ip
   */
  setUserIP: (data: string) => void;
  /**
   * 设置底部公告栏
   * @param data 字符串
   */
  setNotice: (data: string) => void;
  /**
   * 修改状态
   * @param data 0：群聊 1：私聊
   */
  setChatState: (data: number) => void;
  /**
   * 修改正在聊天的人ip
   * @param data ip
   */
  setCarriedIP: (data: string) => void;
  /**
   * 添加私聊数据
   * @param data 单条数据
   */
  addPrivateInfoData: (data: {}) => void;
  /**
   * 设置私聊数据（初次）
   * @param data
   */
  setPrivateInfoData: (data: {}) => void;
  /**
   * 设置私聊聊天列表（有人找你聊天时的列表）
   * @param data (isFlag, ip)
   * @returns 
   */
  setPrivateInfoList: (data: {}) => void;
  /**
   * 修改私聊聊天列表（点击聊天列表的时候）
   * @param ip 查找对应ip 
   * @param route 当前VueRoute 对象
   * @param cb 修改完毕后的回调函数
   * @returns 
   */
  updatePrivateInfoList: (ip: string, route: RouteLocationNormalizedLoaded, cb: Function) => void;
  /**
   * 添加群聊数据
   * @param data 单条聊天数据
   */
  addGroupInfoData: (data: {}) => void;
  /**
   * 设置群聊数据（初次）
   * @param data 数据
   */
  setGroupInfoData: (data: []) => void;
  /**
   * 处理所有群聊Ws事件
   * @param data 所有事件
   * @param route useRoute实例
   * @param router useRouter实例
   * @augments 剩余参数
   */
  handleGroupAllWs: (data: any, route, router, ...arg) => void;
}
