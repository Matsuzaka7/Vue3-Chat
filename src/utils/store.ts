import store from 'storejs';

// 获取session的值
function getSession(key: string) {
  return sessionStorage.getItem(key);
}
// 存储session内的值
function setSession(key: string, val: any) {
  sessionStorage.setItem(key, val);
}
// 删除session内的值
function removeSession(key: string) {
  sessionStorage.removeItem(key);
}

// 获取localStore内的值
function getStore(key: string) {
  return store.get(key);
}
// 存储localStore内的值
function setStore(key: string, val: any) {
  store.set(key, val);
}
// 删除localStore内的值
function removeStore(key: string) {
  store.remove(key);
}
export {
  getStore,
  setStore,
  removeStore,
  getSession,
  setSession,
  removeSession,
};
