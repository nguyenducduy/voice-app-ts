import { Action, Mutation, Module, VuexModule } from 'vuex-module-decorators';
import config from '@/config';
const fecha = require('fecha');
const localstorage = require('tns-core-modules/application-settings');
const sqlite = require('nativescript-sqlite');

@Module
export default class Users extends VuexModule {

  @Mutation ADD_USER(id) {
    localstorage.setNumber('activeUserId', parseInt(id));
  }

  @Action({ commit: 'ADD_USER' })
  add_user(payload) {
    const db_promise = new sqlite(config.dbName);
    const datecreated = fecha.format(new Date(), 'YYYY-MM-DD HH:mm:ss');

    const formData = payload[0];

    return db_promise.then(db => {
      db.resultType(sqlite.RESULTSASOBJECT);

      return db.get(
        'SELECT * FROM user WHERE mobilenumber = ?',
        [formData.mobilenumber]
      ).then(row => {
        if (row === null) {
          return db.execSQL("INSERT INTO user (fullname, mobilenumber, email, gender, age, region, datecreated) VALUES (?,?,?,?,?,?,?)",
            [
              formData.fullname,
              formData.mobilenumber,
              formData.email,
              formData.gender,
              formData.age,
              formData.region.value,
              datecreated
            ]).then(id => { return id; });
        } else {
          return row.id;
        }
       });
    });
  }
}
