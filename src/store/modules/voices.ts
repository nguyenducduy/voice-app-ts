import { Action, Mutation, Module, VuexModule } from 'vuex-module-decorators';
import config from '@/config';
const fecha = require('fecha');
const localstorage = require('tns-core-modules/application-settings');
const sqlite = require('nativescript-sqlite');
import * as fs from 'tns-core-modules/file-system';

@Module
export default class Voices extends VuexModule {
  data: any = {};
  totalRecordedLocalItems: number = 0;
  totalItemUploaded: number = 0;

  @Mutation SET_VOICE_RECORDED_LOCAL_TOTAL(count) {
    this.totalRecordedLocalItems = parseInt(count);
  }

  @Mutation SET_VOICE_UPLOADED_TOTAL(count) {
    this.totalItemUploaded = parseInt(count);
  }

  @Mutation SET_VOICES_DATA(rows) {
    this.data = rows[0];
  }

  @Mutation SET_VOICE_UPLOAED(id) {
    if (id > 0) {
      this.totalItemUploaded++;
    }
  }

  @Mutation SET_RESET_VOICE(count) {
    if (count <= this.totalItemUploaded) {
      this.totalItemUploaded = this.totalItemUploaded - parseInt(count);
    }

    this.totalRecordedLocalItems = this.totalRecordedLocalItems - parseInt(count);
  }

  @Action({ commit: 'SET_VOICE_RECORDED_LOCAL_TOTAL' })
  count_voice_recorded_local() {
    const db_promise = new sqlite(config.dbName);
    return db_promise.then(db => {
      db.resultType(sqlite.RESULTSASOBJECT);
      return db.get('SELECT COUNT(*) as total FROM voice')
        .then(row => {
          return row.total;
        });
    });
  }

  @Action({ commit: 'SET_VOICE_UPLOADED_TOTAL' })
  count_voice_uploaded() {
    const db_promise = new sqlite(config.dbName);
    return db_promise.then(db => {
      db.resultType(sqlite.RESULTSASOBJECT);
      return db.get('SELECT COUNT(*) as total FROM voice WHERE status = "in_cloud"')
        .then(row => {
          return row.total;
        });
    });
  }

  @Action
  add_voice(payload) {
    const formData = payload[0];
    const datecreated = fecha.format(new Date(), 'YYYY-MM-DD HH:mm:ss');
    const uid = localstorage.getNumber('activeUserId', 0);
    const vsid = formData.script.id;
    const path = formData.path;
    const db_promise = new sqlite(config.dbName);

    if (uid > 0) {
      return db_promise.then(db => {
        db.resultType(sqlite.RESULTSASOBJECT);
        return db.get('SELECT * FROM voice WHERE vsid = ?', [ vsid ])
          .then(row => {
            if (row === null) {
              return db.execSQL(
                "INSERT INTO voice (uid, vsid, filepath, status, datecreated) VALUES (?,?,?,?,?)",
                [uid, vsid, path, 'in_local', datecreated]
              ).then(vid => {
                console.log('VOICE CREATED: ' + vid);
                return db.execSQL(
                  "UPDATE voice_script SET status = ? WHERE id = ?",
                  [ config.script.status.recorded, vsid ],
                ).then(() => {
                  console.log('VOICE SCRIPT STATUS CHANGED: ' + vsid);
                });
              });
            }
          });
      });
    }
  }

  @Action({ commit: 'SET_VOICES_DATA' })
  get_voices() {
    const db_promise = new sqlite(config.dbName);
    return db_promise.then(db => {
      db.resultType(sqlite.RESULTSASOBJECT);
      return db.all(
        'SELECT * FROM voice v LEFT JOIN voice_script vs on v.vsid = vs.id LEFT JOIN user u ON v.uid = u.id ORDER BY v.datecreated DESC',
      ).then(rows => {
        return rows;
      })
    });
  }

  @Action({ commit: 'SET_VOICES_DATA' })
  upload_voices() {
    const db_promise = new sqlite(config.dbName);
    return db_promise.then(db => {
      db.resultType(sqlite.RESULTSASOBJECT);
      return db.all(
        'SELECT * FROM voice v LEFT JOIN user u ON v.uid = u.id LEFT JOIN voice_script vs ON v.vsid = vs.id WHERE v.status = ? ORDER BY v.id ASC',
        [ 'in_local' ]
      )
    });
  }

  @Action({ commit: 'SET_VOICE_UPLOAED' })
  change_voice_status(payload) {
    const db_promise = new sqlite(config.dbName);
    return db_promise.then(db => {
      db.resultType(sqlite.RESULTSASOBJECT);
      return db.execSQL(
        "UPDATE voice SET status = ? WHERE id = ?",
        [ 'in_cloud', payload[0] ]
      ).then(count => {
        return count;
      });
    });
  }

  @Action({ commit: 'SET_RESET_VOICE' })
  delete_voice_recorded() {
    const db_promise = new sqlite(config.dbName);
    return db_promise.then(db => {
      db.resultType(sqlite.RESULTSASOBJECT);

      return db.execSQL('DELETE FROM voice', [])
        .then(count => {
          const audioFolder = fs.knownFolders.documents().getFolder('audio');
          audioFolder.clear();
          return count;
        });
    });
  }
}
