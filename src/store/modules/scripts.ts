import { Action, Mutation, Module, VuexModule } from 'vuex-module-decorators';
import config from '@/config';
import fetch from '@/utils/fetch';
const fecha = require('fecha');
const sqlite = require('nativescript-sqlite');

@Module
export default class Scripts extends VuexModule {
  tags: any = [];
  data: any = [];
  totalItems: number = 0;
  totalItemDownloaded: number = 0;
  totalItemDeleted: number = 0;
  totalItemRecord: number = 0;

  @Mutation SET_SCRIPTS(data) {
    this.data = data[0].data;
  }

  @Mutation SET_SCRIPT_TAGS(data) {
    this.tags = data[0].data.tagList || null;
  }

  @Mutation SET_SCRIPT_TOTAL(count) {
    this.totalItems = parseInt(count);
  }

  @Mutation SET_RECORD_SCRIPT_TOTAL(count) {
    this.totalItemRecord = parseInt(count);
  }

  @Mutation CHANGE_STATUS(id) {
    if (id > 0) {
      this.totalItems++;
      this.totalItemDownloaded++;
    }
  }

  @Mutation SET_RECORD_SCRIPT(data) {
    this.data = data[0];
  }

  @Mutation SET_SCRIPTS_WILL_DELETE(data) {
    this.data = data[0];
  }

  @Mutation SET_RESET_SCRIPT(count) {
    this.totalItems = this.totalItems - parseInt(count);
  }

  @Action({ commit: 'SET_SCRIPT_TOTAL' })
  count_script_all() {
    const db_promise = new sqlite(config.dbName);
    return db_promise.then(db => {
      db.resultType(sqlite.RESULTSASOBJECT);
      return db.get('SELECT COUNT(*) as total_script FROM voice_script')
        .then(row => {
          return row.total_script;
        });
    });
  }

  @Action({ commit: 'SET_SCRIPTS' })
  download_scripts(tagName) {
    return fetch({
      url: '/api/v1/apps/scripts/load',
      method: 'GET',
      headers: {
        'Cache-Control': 'no-cache'
      },
      params: {
        tag: tagName[0]
      }
    }).then(response => {
      return response.data;
    });
  }

  @Action({ commit: 'SET_SCRIPT_TAGS' })
  get_script_tags() {
    return fetch({
      url: '/api/v1/apps/scripts/tags',
      method: 'GET',
      headers: {
        'Cache-Control': 'no-cache'
      }
    }).then(response => {
      return response.data;
    });
  }

  @Action({ commit: 'CHANGE_STATUS' })
  change_status(formData) {
    return fetch({
      url: '/api/v1/apps/scripts/changestatus',
      method: 'POST',
      data: {
        id: formData[0].id,
        status: formData[0].status
      }
    }).then(response => {
      const myScript = response.data.data;
      const datecreated = fecha.format(new Date(), 'YYYY-MM-DD HH:mm:ss');
      const db_promise = new sqlite(config.dbName);

      return db_promise.then(db => {
        db.resultType(sqlite.RESULTSASOBJECT);
        return db.execSQL("INSERT INTO voice_script (cloudid, tag, command, text, status, datecreated) VALUES (?,?,?,?,?,?)",
          [
            myScript.id,
            myScript.tag,
            myScript.command,
            myScript.text,
            config.script.status.pending,
            datecreated,
          ]).then(id => { return id; });
      });
    });
  }

  @Action({ commit: 'SET_RECORD_SCRIPT' })
  get_record_script() {
    const db_promise = new sqlite(config.dbName);
    return db_promise.then(db => {
      db.resultType(sqlite.RESULTSASOBJECT);
      return db.get(
        'SELECT * FROM voice_script WHERE status = ? ORDER BY command ASC LIMIT 0, 1',
        [ config.script.status.pending ]
      ).then(row => { return row; });
    });
  }

  @Action({ commit: 'SET_RECORD_SCRIPT_TOTAL' })
  count_record_script() {
    const db_promise = new sqlite(config.dbName);
    return db_promise.then(db => {
      db.resultType(sqlite.RESULTSASOBJECT);
      return db.get(
        'SELECT COUNT(*) as total_script FROM voice_script WHERE status = ?',
        [ config.script.status.pending ]
      ).then(row => { return row.total_script; });
    });
  }

  @Action({ commit: 'SET_SCRIPTS_WILL_DELETE' })
  reset_script() {
    const db_promise = new sqlite(config.dbName);
    return db_promise.then(db => {
      db.resultType(sqlite.RESULTSASOBJECT);
      // release all pending script to server
      return db.all('SELECT * FROM voice_script WHERE status = ?', [ config.script.status.pending ])
        .then(rows => {
          return rows;
        });
    });
  }

  @Action
  delete_script(formData) {
    const cloudid = formData[0].cloudid;

    return fetch({
      url: `/api/v1/apps/scripts/reset`,
      method: 'POST',
      headers: {
        'Cache-Control': 'no-cache'
      },
      data: {
        id: cloudid
      }
    })
  }

  @Action({ commit: 'SET_RESET_SCRIPT' })
  clean_script() {
    const db_promise = new sqlite(config.dbName);

    return db_promise.then(db => {
      return db.execSQL('DELETE FROM voice_script', [])
        .then(count => {
          console.log('SCRIPT TOTAL DEL: ' + count)
          return count;
        })
    });
  }
}
