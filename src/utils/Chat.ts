import { toByteArray } from 'base64-js'
import { debounce } from "./debounce";

/**
 * base64解析
 * @param base64 base64字符串
 */
export const base64ToUtf8 = (base64: string) => {
  return new TextDecoder().decode(toByteArray(base64))
}

// 缓慢滚动的函数
function scrollTo(element, to, duration) {
  const start = element.scrollTop;
  const change = to - start;
  const startTime = performance.now();
  function easeInOutQuad(t, b, c, d) {
    t /= d / 2;
    if (t < 1) return (c / 2) * t * t + b;
    t--;
    return (-c / 2) * (t * (t - 2) - 1) + b;
  }
  function animateScroll() {
    const currentTime = performance.now();
    const elapsed = currentTime - startTime;
    element.scrollTop = easeInOutQuad(elapsed, start, change, duration);
    if (elapsed < duration) {
      requestAnimationFrame(animateScroll);
    } else {
      element.scrollTop = to;
    }
  }
  animateScroll();
}

/**
 * 滚动到底部的函数
 * @param immediate 是否关闭滑动效果 - 默认false
 */
export function scrollBottom(immediate: boolean = false) {
  const last_child = document.querySelector(".chat-info-container:last-child");
  if (immediate) {
    last_child.scrollIntoView();
    return 
  }
  
  const container = document.querySelector(".ChatInfo");
  if (last_child) {
    scrollTo(container, last_child.offsetTop, 500);
  } 
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
