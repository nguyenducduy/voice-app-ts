import Vue from 'nativescript-vue';
import { isAndroid, isIOS } from 'tns-core-modules/platform';
import router from './router';
import store from './store/index';
import { sync } from 'vuex-router-sync';
import './styles.scss';
const localstorage = require('tns-core-modules/application-settings');
import config from './config';

import { CheckBox } from 'nativescript-checkbox';
Vue.registerElement('CheckBox', () => CheckBox);

const IQKeyboardManager = require('nativescript-iqkeyboardmanager');
Vue.registerElement('PreviousNextView', () => IQKeyboardManager.PreviousNextView);

const GradientLayout = require('nativescript-gradient');
Vue.registerElement('Gradient', () => GradientLayout.Gradient);

import { TNSFontIcon, fonticon } from 'nativescript-fonticon';
TNSFontIcon.paths = {
  fa: './FontAwesome.css',
};
TNSFontIcon.loadCss();
Vue.filter('fonticon', fonticon);

import { TNSEZRecorder } from 'nativescript-ezaudio';
const recorder = new TNSEZRecorder();

Vue.prototype.$isAndroid = isAndroid;
Vue.prototype.$isIOS = isIOS;
Vue.prototype.$recorder = recorder;

Vue.config.silent = true;
sync(store, router);

const sqlite = require('nativescript-sqlite');
const db_promise = new sqlite(config.dbName)
db_promise.then(db => {
  // Create voice_script table
  db.execSQL('CREATE TABLE IF NOT EXISTS voice_script (id INTEGER PRIMARY KEY AUTOINCREMENT, cloudid INTEGER(11), tag CHAR(50), command CHAR(50), text TEXT, status INTEGER(2), datecreated DATETIME)',
    [],
    function(err) {
      console.log("TABLE voice_script CREATED");
    }
  );
  db.execSQL('CREATE INDEX IF NOT EXISTS voiceindex ON voice_script (id, cloudid, tag, command, status)',
    [],
    function(err) {
      console.log("INDEX voice_script CREATED");
    }
  );

  // Create user table
  db.execSQL('CREATE TABLE IF NOT EXISTS user (id INTEGER PRIMARY KEY AUTOINCREMENT, fullname TEXT, mobilenumber CHAR(11), email TEXT, gender INTEGER(1), age INTEGER(2), region INTEGER(2), datecreated DATETIME)',
    [],
    function(err) {
      console.log("TABLE user CREATED");
    }
  );
  db.execSQL('CREATE INDEX IF NOT EXISTS userindex ON user (id, mobilenumber, email)',
    [],
    function(err) {
      console.log("INDEX user CREATED");
    }
  );

  // create voice table
  db.execSQL('CREATE TABLE IF NOT EXISTS voice (id INTEGER PRIMARY KEY AUTOINCREMENT, uid INTEGER(11), vsid INTEGER(11), filepath TEXT, status CHAR(30), hashtag TEXT, datecreated DATETIME)',
    [],
    function(err) {
      console.log("TABLE voice CREATED");
    }
  );
  db.execSQL('CREATE INDEX IF NOT EXISTS voiceindex ON voice (id, uid, vsid, status)',
    [],
    function(err) {
      console.log("INDEX voice CREATED");
    }
  );
  db.close();
})

new Vue({
  router,
  store
}).$start();
