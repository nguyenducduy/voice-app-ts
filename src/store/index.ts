import Vue from 'nativescript-vue';
import Vuex from 'vuex';

import users from './modules/users';
import scripts from './modules/scripts';
import voices from './modules/voices';
import events from './modules/events';

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {},
  modules: {
    users,
    scripts,
    voices,
    events
  }
});

Vue.prototype.$store = store;

export default store;
