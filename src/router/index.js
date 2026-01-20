import { createRouter, createWebHistory } from "vue-router";
import Login from '../components/admin/login_admin.vue'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'login-admin',
            component: Login
        },
        {
            path: '/form-lpk',
            name: 'form-lpk',
            component: () => import('../components/user/form_lpk.vue')
        },
        {
            path: '/log-permintaan',
            name: 'log-permintaan',
            component: () => import('../components/user/log_permintaan.vue')
        },
    ],
    scrollBehavior(to, from, savedPosition) {
        return { top: 0 }
    }
})

export default router;