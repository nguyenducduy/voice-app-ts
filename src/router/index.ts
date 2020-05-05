import Vue from 'nativescript-vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);

import HomePage from '../pages/Home.vue';
import UserPage from '../pages/User.vue';
import RecordPage from '../pages/Record.vue';
import SettingPage from '../pages/Setting.vue';
import HistoryPage from '../pages/History.vue';

const router = new VueRouter({
  pageRouting: true,
  routes: [
    {
      path: '/home',
      component: HomePage,
      meta: {
        title: 'Home'
      }
    },
    {
      path: '/user',
      component: UserPage,
      meta: {
        title: 'User'
      }
    },
    {
      path: '/record',
      component: RecordPage,
      meta: {
        title: 'Record'
      }
    },
    {
      path: '/setting',
      component: SettingPage,
      meta: {
        title: 'Setting'
      }
    },
    {
      path: '/history',
      component: HistoryPage,
      meta: {
        title: 'History'
      }
    },
    { path: '*', redirect: '/home' }
  ]
});

router.replace('/home');

export default router;
