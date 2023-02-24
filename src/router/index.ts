import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import privateStore from '@/store/privateStore';

const routes:Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/groupChat'
  },
  {
    path: '/groupChat',
    component: () => import('@/pages/GroupChat'),
    meta: { index: 0 }
  },
  {
    name: 'privateChat',
    path: '/privateChat/:ip',
    meta: { index: 1 },
    component: () => import('@/pages/privateChat'),
    beforeEnter: (to, from) => {
      const privateS = privateStore()
      // 判断地址url是否和pinia中的目标ip一致，避免有人修改url后访问
      if (to.params.ip === privateS.carriedIP) {
        return true
      } else {
        return false
      }
    }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router