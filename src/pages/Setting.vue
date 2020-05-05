<template>
  <Page class="page">
    <ActionBar class="action-bar" title="Thiết lập">
      <NavigationButton android.systemIcon="ic_menu_back" @tap="onGoHome" />
    </ActionBar>
    <GridLayout rows="*,2*">
      <GridLayout row="0">
        <GridLayout rows="*,*" columns="*,*">
          <StackLayout row="0" col="0" orientation="vertical">
            <count-script></count-script>
          </StackLayout>
          <StackLayout row="0" col="1" orientation="vertical">
            <count-uploaded></count-uploaded>
          </StackLayout>
          <StackLayout row="1" col="0" orientation="vertical">
            <count-recorded></count-recorded>
          </StackLayout>
          <StackLayout row="1" col="1" orientation="vertical">
            <count-remaining></count-remaining>
          </StackLayout>
        </GridLayout>
      </GridLayout>
      <ScrollView row="1" class="setting_container" :scrollBarIndicatorVisible="false">
        <GridLayout rows="auto,auto,auto,auto,auto,auto,auto" columns="*" orientation="vertical" verticalAlignment="bottom">
          <StackLayout row="0">
            <Label horizontalAlignment="right" :text="`Đang tải ${countUploading}/${countUpload}`" v-show="countUploading < countUpload" class="m-b-5"></Label>
            <Progress :value="countUploading" :maxValue="countUpload" color="#ff4757" v-show="countUploading < countUpload" class="m-b-5" />
          </StackLayout>
          <StackLayout row="1" class="setting_item">
            <PreviousNextView>
              <GridLayout rows="*" columns="4*,*">
                <Label row="0" col="0" text="Số câu thu mỗi lượt" />
                <TextField row="0" col="1" class="input" keyboardType="phone" v-model="recordLimitPerSession" @textChange="onChangeLimit" maxLength="3" />
              </GridLayout>
            </PreviousNextView>
          </StackLayout>
          <StackLayout row="2" :class="`setting_item ${isOnline ? 'online' : 'offline'}`">
            <Button textAlignment="left" @tap="onOpenEventModal" :isEnabled="isOnline">
              <FormattedString>
                <Span :text="activeEvent !== null ? `${activeEvent.name}   ` : 'Chọn sự kiện   '" fontWeight="bold"></Span>
                <Span class="fa" :text="'fa-angle-down'|fonticon" fontSize="20"></Span>
              </FormattedString>
            </Button>
          </StackLayout>
          <StackLayout row="3" :class="`setting_item ${isOnline ? 'online' : 'offline'}`">
            <Button text="Tải câu" textAlignment="left" @tap="onOpenDownloadModal" :isEnabled="isOnline"></Button>
          </StackLayout>
          <StackLayout row="4" :class="`setting_item ${isOnline ? 'online' : 'offline'}`">
            <Button text="Upload những câu đã thu âm" textAlignment="left" @tap="onUploadRecorded" :isEnabled="isOnline"></Button>
          </StackLayout>
          <StackLayout row="5" class="setting_item">
            <Button text="Lịch sử thu" textAlignment="left" @tap="onGoHistory"></Button>
          </StackLayout>
          <StackLayout row="6" :class="`setting_item ${isOnline ? 'online' : 'offline'} remove`">
            <Button text="Reset" textAlignment="left" @tap="onReset" :isEnabled="isOnline"></Button>
          </StackLayout>
        </GridLayout>
      </ScrollView>
    </GridLayout>
  </Page>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import { Action, State } from 'vuex-class';
import CountUploaded from '@/components/setting/CountUploaded.vue';
import CountRecorded from '@/components/setting/CountRecorded.vue';
import CountScript from '@/components/setting/CountScript.vue';
import CountRemaining from '@/components/setting/CountRemaining.vue';
import DownloadModal from '@/components/setting/DownloadModal.vue';
import EventModal from '@/components/setting/EventModal.vue';
import config from '@/config';
import { Feedback } from 'nativescript-feedback';
import {
  CFAlertDialog,
  DialogOptions,
  CFAlertGravity,
  CFAlertActionAlignment,
  CFAlertActionStyle,
  CFAlertStyle
} from 'nativescript-cfalert-dialog';
const bghttp = require('nativescript-background-http');
const localstorage = require('tns-core-modules/application-settings');
import { LoadingIndicator } from 'nativescript-loading-indicator';
import * as fs from 'tns-core-modules/file-system';
const connectivityModule = require('tns-core-modules/connectivity');
import HistoryPage from '@/pages/History.vue';
import HomePage from '@/pages/Home.vue';

@Component({
  components: {
    CountUploaded,
    CountRecorded,
    CountScript,
    CountRemaining
  }
})
export default class SettingPage extends Vue {
  @State(state => state.voices.data) myVoices;
  @State(state => state.scripts.data) myScripts;
  @Action('upload_voices') uploadAction;
  @Action('change_voice_status') changeVoiceStatusAction;
  @Action('delete_voice_recorded') deleteVoiceRecordedAction;
  @Action('reset_script') resetScriptAction;
  @Action('delete_script') deleteScriptAction;
  @Action('clean_script') cleanScriptAction;

  feedback: any;
  dialog: any;
  loader: any;
  audioFolder: any;
  countUpload: number = 0;
  countUploading: number = 0;
  activeEvent: any = null;
  resetCount: number = 0;
  recordLimitPerSession: number = 0;

  constructor() {
    super();
    this.feedback = new Feedback();
    this.dialog = new CFAlertDialog();
    this.loader = new LoadingIndicator();
    this.audioFolder = fs.knownFolders.documents().getFolder('audio');
  }

  get isOnline() {
    const connectionType = connectivityModule.getConnectionType();
    let isOnline = false;

     switch (connectionType) {
      case connectivityModule.connectionType.none:
          // Denotes no Internet connection.
          isOnline = false;
          break;
      case connectivityModule.connectionType.wifi:
          // Denotes a WiFi connection.
          isOnline = true;
          break;
      case connectivityModule.connectionType.mobile:
          // Denotes a mobile connection, i.e. cellular network or WAN.
          isOnline = true;
          break;
     }

     return isOnline;
  }

  onOpenDownloadModal() {
    this.$showModal(DownloadModal)
  }

  onOpenEventModal() {
    this.$showModal(EventModal)
      .then(data => {
        this.activeEvent = data;
      });
  }

  onUploadRecorded() {
    const self = this;

    if (this.activeEvent === null) {
      self.feedback.info({
        message: `Vui lòng chọn sự kiện `
      });

      return;
    }

    this.uploadAction()
      .then(() => {
        self.countUpload = self.myVoices.length;

        if (self.myVoices.length === 0) {
          self.feedback.info({
            message: `Không có câu mới để tải lên`
          });
        } else {
          self.myVoices.map(voice => {
            return this._upload(voice);
          })
        }
      });
  }

  onReset() {
    return this._showConfirm();
  }

  onGoHistory() {
    this.$navigateTo(HistoryPage);
  }

  onGoHome() {
    this.$navigateTo(HomePage);
  }

  onChangeLimit() {
    localstorage.setNumber('recordLimitPerSession', parseInt(this.recordLimitPerSession));
    console.log('CHANGE LIMIT: --------------------- ' + this.recordLimitPerSession);
    
  }

  mounted() {
    const activeEvent = localstorage.getString('activeEvent');
    if (typeof activeEvent !== 'undefined' && activeEvent !== '') {
      this.activeEvent = JSON.parse(activeEvent);
    }

    const limitRecord = localstorage.getNumber('recordLimitPerSession');
    console.dir(limitRecord);

    if (typeof limitRecord !== 'undefined' && limitRecord >= config.recordLimitPerSession) {
      this.recordLimitPerSession = limitRecord;
    } else {
      this.recordLimitPerSession = config.recordLimitPerSession;
      localstorage.setNumber('recordLimitPerSession', config.recordLimitPerSession);
    }
  }

  _showConfirm() {
    const self = this;

    let options: DialogOptions = {
      dialogStyle: CFAlertStyle.BOTTOM_SHEET,
      title: 'Reset',
      message: 'Thao tác này sẽ xoá toàn bộ những câu đã thu âm hiện có trong ứng dụng và không thể khôi phục lại. Bạn có chắc không?',
      buttons: [
        {
          text: 'Có',
          buttonStyle: CFAlertActionStyle.POSITIVE,
          textColor: '#fff',
          backgroundColor: '#ff4757',
          onClick: function(response) {
            self.loader.show();

            // reset app settings
            localstorage.setNumber('activeUserId', 0);
            localstorage.setString('activeEvent', '');
            localstorage.setNumber('recordLimitPerSession', config.recordLimitPerSession);

            // release pending script to server
            self.resetScriptAction()
              .then(() => {
                if (self.myScripts.length > 0) {
                  const multi_promise = self.myScripts.map(script => {
                    self.resetCount++;
                    return self.deleteScriptAction({ cloudid: script.cloudid });
                  })

                  Promise.all(multi_promise).then(function(results) {
                    self.loader.hide();
                    self.resetCount = 0;
                    self.activeEvent = null;

                    // delete all script
                    self.cleanScriptAction();
                    // delete all voice (include files recorded)
                    self.deleteVoiceRecordedAction();
                  })
                } else {
                  // delete all script
                  self.cleanScriptAction();
                  // delete all voice (include files recorded)
                  self.deleteVoiceRecordedAction();
                  self.loader.hide();
                }
              });
          }
        },
        {
          text: 'Không',
          buttonStyle: CFAlertActionStyle.NEGATIVE,
          textColor: '#333',
          backgroundColor: '#fff8f8',
          onClick: function(response) {
            return;
          }
        }
      ]
    };

    this.dialog.show(options);
  }

  _upload(row) {
    const self = this;

    const feedback = new Feedback();
    const session = bghttp.session(`voice-upload-${row.id}`);

    const request = {
      url: `${config.apiUrl}/api/v1/apps/upload`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/octet-stream',
        'File-Name': row.id
      },
    };

    let task = bghttp.Task;

    let params = [
      { name: "uid", value: row.uid },
      { name: "veid", value: self.activeEvent.id },
      { name: "vsaid", value: row.cloudid },
      { name: "mobilenumber", value: row.mobilenumber },
      { name: "fullname", value: row.fullname },
      { name: "email", value: row.email },
      { name: "gender", value: row.gender },
      { name: "age", value: row.age },
      { name: "region", value: row.region },
      { name: "audio", filename: `${self.audioFolder.path}/${row.filepath}`, mimeType: 'audio/mp4' }
    ];

    task = session.multipartUpload(params, request);

    task.on('responded', function(e) {
      self.countUploading++;

      const response = JSON.parse(e.data);

      if (typeof response.errors !== 'undefined') {
        const msg = response.errors.message.toString();
        feedback.error({
          message: `SERVER ERROR: ${msg}`
        });
      }

      // Change status to in_cloud
      self.changeVoiceStatusAction(row.id);

      if (self.countUploading === self.countUpload) {
        self.feedback.success({
          message: `${self.countUpload} câu đã được tải lên`
        });
        self.countUpload = 0;
        self.countUploading = 0;
      }
    });
  }
}
</script>

<style scoped>
.setting_container {
  margin: 10;
}
.setting_item {
  background-color: #fff8f8;
  color: #2f3542;
  padding: 8;
  margin-bottom: 5;
  border-radius: 5;
}
.remove {
  color: #ff4757;
}
.offline {
  background-color: #1e3694;
  color: #57606f;
}
.input {
  border-width: 1;
  border-color: #dedede;
  border-radius: 5;
  padding: 3;
  background-color: #fff;
  text-align: center;
}
</style>
