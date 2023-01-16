import { debounce } from "./debounce";
// 滚动到底部的函数
export function scrollBottom() {
  let last_child = document.querySelector(".chat-info-container:last-child");
  if (last_child) last_child.scrollIntoView();
}

// 当页面大小变化时, 是否需要滚动到底部？
export function resizeChange() {
  setTimeout(() => {
    let ChatInfo: HTMLDivElement = document.querySelector(".ChatInfo")!;
    const cancelDebounce = debounce(() => {
      if (ChatInfo.scrollHeight - (ChatInfo.offsetHeight + ChatInfo.scrollTop) <= window.innerHeight / 3) {
        setTimeout(() => scrollBottom());
      }
    }, 200)
    window.addEventListener("resize", cancelDebounce);
  }, 200);
}