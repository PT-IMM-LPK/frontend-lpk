import { createRouter, createWebHistory } from "vue-router";
import FormLpk from '../components/form_lpk.vue'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'form',
            component: FormLpk
        }
    ],
    scrollBehavior(to, from, savedPosition) {
        return { top: 0 }
    }
})

export default router;