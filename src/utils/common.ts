/**
 * 检测用户是否停留在本网页
 * @function activation 用户回来时的回调
 * @function inactivation 用户离开时的回调
 */
export const detectionActivity = (activation: Function, inactivation: Function) => {
  const documentTitle = document.title
  
  // 获取焦点事件
  window.addEventListener("focus", () => {
    activation && activation()
    document.title = documentTitle
  });

  // 失去焦点事件
  window.addEventListener("blur", () => {
    inactivation && inactivation()
  });

  // 更换标签页
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") {
      inactivation && inactivation()
    } else {
      activation && activation()
      document.title = documentTitle
    }
  });
};

/**
 * title滚动效果
 * @param title ?标题
 * @param time ?切换滚动的时间
 * @returns [开启滚动效果函数, 暂停滚动效果函数]
 */
export const scrollTitle = (title = document.title, time = 400) => {
  const documentTitle = document.title
  let step = 0;
  let timer = 0;
  const scrollMSG = () => {
    document.title = title.substring(step, title.length) + title.substring(0, step);
    document.title += '...'; step++;
    if (step > title.length) step = 0;
  }
  timer = setInterval(scrollMSG, time);
  return [
    () => timer = setInterval(scrollMSG, time),
    () => {
      clearInterval(timer);
      document.title = documentTitle;
    }
  ]
}