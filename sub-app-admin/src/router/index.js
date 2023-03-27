import {createRouter, createWebHistory} from "vue-router";

import HomeLayout from "@/components/layout/HomeLayout.vue";
import BaseLayout from "@/components/layout/BaseLayout.vue";
import Role from "@/views/security/Role.vue";
import Permission from "@/views/security/Permission.vue"
import RequestPath from "@/views/security/RequestPath.vue"

const routes = [
    {
        path: "/login",
        name: "Login",
        meta: {
            title: "登录"
        },
        children: [],
        component: () => import("@/views/user/login.vue")
    },
    {
        path: "/admin/user/role",
        name: "role",
        meta: {
            title: "角色管理",
            icon: "user-group"
        },
        component: Role
    },
    {
        path: "/admin/user/permission",
        name: "permission",
        meta: {
            title: "权限管理",
            icon: "key"
        },
        component: Permission
    },
    {
        path: "/admin/user/request-path",
        name: "request-path",
        meta: {
            title: "路径管理",
            icon: "globe-alt"
        },
        component: RequestPath
    },
    {
        path: "/admin/user/user",
        name: "user",
        meta: {
            title: "用户管理",
            icon: "user"
        },
        component: () => import("@/views/security/User.vue")
    },
    {
        path: '/',
        name: 'Home',
        component: HomeLayout,
        meta: {
            title: "Home"
        },
        children: [
            {
                path: "/",
                name: "security",
                meta: {
                    title: "安全管理",
                    icon: "shield-check"
                },
                component: BaseLayout,
                children: []
            }, {
                path: "/",
                name: "dynamic",
                meta: {
                    title: "动态管理",
                    icon: "annotation"
                },
                component: BaseLayout,
                children: [
                    {
                        path: "/admin/dynamic/dynamic",
                        meta: {
                            title: "动态审核",
                            icon: "star"
                        },
                        component: () => import("@/views/dynamic/dynamic.vue")
                    }
                ]
            }, {
                path: "/",
                name: "store",
                component: BaseLayout,
                meta: {
                    title: "店铺管理",
                    icon: "shopping-bag"
                },
                children: [
                    {
                        path: "/store/apply",
                        name: "storeApply",
                        meta: {
                            title: "店铺审核",
                            icon: "shopping-bag"
                        },
                        component: () => import("@/views/store/storeApply.vue"),
                    }, {
                        path: "/store/manager",
                        name: "storeManager",
                        meta: {
                            title: "店铺管理",
                            icon: "shopping-bag"
                        },
                        component: () => import("@/views/store/storeManager.vue")
                    }, {
                        path: "/store/order",
                        name: "storeOrder",
                        meta: {
                            title: "订单管理",
                            icon: "shopping-bag"
                        },
                        hide: true,
                        component: () => import("@/views/store/storeOrder.vue")
                    }, {
                        path: "/store/coupon",
                        name: "storeCoupon",
                        meta: {
                            title: "优惠券管理",
                            icon: "shopping-bag"
                        },
                        hide: true,
                        component: () => import("@/views/store/storeCoupon.vue")
                    }, {
                        path: "/store/printer",
                        name: "storePrinter",
                        meta: {
                            title: "打印机管理",
                            icon: "shopping-bag"
                        },
                        component: () => import("@/views/store/storePrinter.vue")
                    }
                ]
            },
            {
                path: "/",
                name: "recommend",
                component: BaseLayout,
                meta: {
                    title: "推荐管理",
                    icon: "annotation"
                },
                children: [
                    {
                        path: "/recommend/user",
                        name: "userRecommend",
                        meta: {
                            title: "用户推荐",
                            icon: "shopping-bag"
                        },
                        component: () => import("@/views/recommend/userRecommend.vue")
                    }, {
                        path: "/recommend/adManager",
                        name: "adManager",
                        meta: {
                            title: "广告管理",
                            icon: "shopping-bag"
                        },
                        component: () => import("@/views/recommend/adManagement.vue")
                    }
                ]
            }
        ]
    }

]
// 导出路由
const router = createRouter({
    history: createWebHistory("/admin/client/"),
    routes
});
router.afterEach(to => {
    document.title = to.meta.title
})
export {routes}
export default router
