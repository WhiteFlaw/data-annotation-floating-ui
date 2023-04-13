import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true,
    alias: '/switch-platform'
  },
  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },
  {
    path: '/data-management',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'DataManagement',
        component: () => import('@/views/dataManagement/index'),
        meta: { title: '数据导入', icon: 'data-management' }
      }
    ]
  },
  {
    path: '/customer-management',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'CustomerManagement',
        component: () => import('@/views/customerManagement/index'),
        meta: { title: '客户管理', icon: 'customer-management' }
      }
    ]
  },
  {
    path: '/project-management',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'ProjectManagement',
        component: () => import('@/views/projectManagement/index'),
        meta: { title: '项目管理', icon: 'project-management' }
      }
    ]
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('@/views/dashboard/index'),
        meta: { title: '我的工作台', icon: 'dashboard' }
      }
    ]
  },
  {
    path: '/3d-annotate',
    component: () => import('@/views/annotate/index'),
    name: 'Annotation',
    meta: {
      title: '开始3D标注',
      icon: 'link'
    }
  },
  {
    path: '/annotate',
    component: Layout,
    children: [
      {
        path: 'index',
        name: '3d',
        component: () => import('@/views/annotate/index'),
        meta: { title: '标注-內', icon: 'dashboard' }
      }
    ]
  },

  {
    path: '/teamManagement',
    component: Layout,
    meta: { title: '团队管理'},
    children: [
      {
        path: 'userManagement',
        name: 'userManagement',
        component: () => import('@/views/teamManagement/userManagement'),
        meta: { title: '用户管理'}
      },
      {
        path: 'team',
        component: () => import('@/views/teamManagement'),
        redirect: '/teamList',
        children: [
          {
            path: 'teamList',
            name: 'teamList',
            component: () => import('@/views/teamManagement/teamList'),
            meta: {
              title: '团队列表',
              roles: ['teamList']
            }
          },
          {
            path: 'teamListDetail',
            component: () => import('@/views/teamManagement'),
            redirect: '/teamManagement/team/teamList',
            meta: {
              title: '团队列表',
              roles: ['teamListDetail']
            },
            hidden: true,
            children: [
              {
                path: 'teamDetail',
                name: 'teamDetail',
                component: () => import('@/views/teamManagement/teamList/components/teamDetail'),
                meta: {title: '团队详情'}
              }
            ]
          }
        ]
      }
    ]
  },
  // {
  //   path: 'external-link',
  //   component: Layout,
  //   children: [
  //     {
  //       path: 'https://panjiachen.github.io/vue-element-admin-site/#/',
  //       meta: { title: 'External Link', icon: 'link' }
  //     }
  //   ]
  // },

  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () =>
  new Router({
    // mode: 'history', // require service support
    scrollBehavior: () => ({ y: 0 }),
    routes: constantRoutes
  })

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
