<template>
  <Page class="page">
    <ActionBar class="action-bar" title="Thu âm">
      <NavigationButton android.systemIcon="ic_menu_back" @tap="onQuit"/>
    </ActionBar>
    <StackLayout orientation="vertical">
      <StackLayout height="10%" verticalAlignment="top">
        <Label class="intro-text m-10" :textWrap="true" horizontalAlignment="center">
          <FormattedString v-if="recording === false">
            <Span text="Bấm nút  " />
            <Span class="fa" :text="'fa-microphone' | fonticon" color="#ff4757"/>
            <Span text="  và đọc câu bên dưới" />
          </FormattedString>
          <FormattedString v-else>
            <Span text="Bấm nút  " />
            <Span class="fa" :text="'fa-arrow-right' | fonticon" color="#ff4757"/>
            <Span text="  để chuyển câu kế tiếp" />
          </FormattedString>
        </Label>
      </StackLayout>
      <StackLayout height="5%" class="m-r-10"></StackLayout>
      <StackLayout height="50%" verticalAlignment="center" class="script_content p-8">
        <Label :text="`${count}/${totalItems}`" color="#ff4757"></Label>
        <Label :text="myScript.text"
          horizontalAlignment="center"
          marginTop="20"
          :textWrap="true">
        </Label>
      </StackLayout>
      <StackLayout height="10%" orientation="horizontal">
        <GridLayout rows="*" columns="*,*,*">
          <Label row="0" col="1" :text="recordTime" color="#ff4757" v-show="recordTime !== '0'" horizontalAlignment="center" width="100%" textAlignment="center"></Label>
        </GridLayout>
      </StackLayout>
      <StackLayout height="25%" orientation="horizontal" verticalAlignment="bottom" class="m-b-10">
        <GridLayout columns="*, *, *">
          <StackLayout col="0" row="0">
            <Button class="btn" width="100" height="100" @tap="onReset" color="#333">Thu lại</Button>
          </StackLayout>
          <StackLayout col="1" row="0">
            <Button class="btn btn-primary start-btn fa" :text="'fa-microphone' | fonticon" width="100" height="100" @tap="onStart" v-show="recording === false"></Button>
            <Button class="btn btn-primary stop-btn fa pulse" :text="'fa-arrow-right' | fonticon" width="100" height="100" @tap="onStop" v-show="recording === true"></Button>
          </StackLayout>
          <StackLayout col="2" row="0">
            <Button class="btn" width="100" height="100" @tap="onQuit" color="#333">Kết thúc</Button>
          </StackLayout>
        </GridLayout>
      </StackLayout>
    </StackLayout>
  </Page>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import { Action, State } from 'vuex-class';
import {
  CFAlertDialog,
  DialogOptions,
  CFAlertGravity,
  CFAlertActionAlignment,
  CFAlertActionStyle,
  CFAlertStyle
} from 'nativescript-cfalert-dialog';
import * as fs from 'tns-core-modules/file-system';
import config from '@/config';
const localstorage = require('tns-core-modules/application-settings');
import HomePage from '@/pages/Home.vue';

@Component
export default class RecordPage extends Vue {
  @State(state => state.scripts.data) myScript;
  @State(state => state.scripts.totalItemRecord) totalItems;
  @Action('get_record_script') getRecordScriptAction;
  @Action('count_record_script') countRecordScriptAction;
  @Action('add_voice') addVoiceAction;

  dialog: CFAlertDialog;
  recording: boolean = false;
  recordingPath: string = '';
  recordTime: string = '0';
  recordFile: string = '';
  count: number = 0;
  recordLimitPerSession: number = 0;

  constructor() {
    super();
    this.dialog = new CFAlertDialog();
  }

  onStart() {
    return this._start();
  }

  onStop() {
    return this._stop();
  }

  onQuit() {
    return this._showExit('quit');
  }

  onReset() {
    if (this.$recorder.isRecording()) {
      this.$recorder.stop();
      this.recording = false;
      this.recordTime = '0';
    }

    this._start();
  }

  mounted() {
    const self = this;

    this.$recorder.delegate().audioEvents.on('recordTime', (eventData) => {
      self.recordTime = eventData.data.time;

      const stringTimeOut = '00:' + config.recordTimeout;
      if (eventData.data.time === stringTimeOut) {
        if (self.$recorder.isRecording()) {
          self.$recorder.stop();
        }
        self.recording = false;
        self.recordTime = '0';
      }
    });

    this.getRecordScriptAction()
      .then(() => {
        this._start();
        this.count++;
      });

    this.countRecordScriptAction();

    this.recordLimitPerSession = localstorage.getNumber('recordLimitPerSession');
  }

  _start() {
    if (this.myScript !== null && this.myScript.command.length > 0 && this.count < this.recordLimitPerSession + 1) {
      let audioFolder = fs.knownFolders.documents().getFolder('audio');
      const filename = this.myScript.command + '_' +  Math.floor(Date.now() / 1000) + '.m4a';
      this.recordingPath = `${audioFolder.path}/${filename}`;
      this.recordFile = filename;
      this.$recorder.record(this.recordingPath);
      this.recording = true;
    } else {
      this._showExit('done');
    }
  }

  _stop() {
    const self = this;

    this.$recorder.stop();
    this.recording = false;
    this.recordTime = '0';
    this.addVoiceAction({
      script: self.myScript,
      path: self.recordFile
    }).then(() => {
      this.getRecordScriptAction()
        .then(() => {
          if (this.myScript !== null) {
            this.count++;
            this._start();
          } else {
            this._showExit('done');
          }
        });
    });
  }

  _showExit(type) {
    const self = this;
    let options: any = null;

    switch(type) {
      case 'done':
        options = {
          dialogStyle: CFAlertStyle.BOTTOM_SHEET,
          title: 'Hoàn thành',
          message: `Bạn đã hoàn thành phần thu âm. Giới hạn ${self.recordLimitPerSession} câu/lượt thu`,
          cancellable: false,
          buttons: [
            {
              text: 'Về trang chủ',
              buttonStyle: CFAlertActionStyle.POSITIVE,
              textColor: '#fff',
              backgroundColor: '#ff4757',
              onClick: function(response) {
                if (self.$recorder.isRecording()) {
                  self.$recorder.stop();
                }

                localstorage.setNumber('activeUserId', 0);
                return self.$navigateTo(HomePage, { clearHistory: true });
              }
            }
          ]
        };
        break;
      default:
        options = {
          dialogStyle: CFAlertStyle.BOTTOM_SHEET,
          title: 'Ngừng thu âm',
          message: 'Bạn có chắc muốn dừng thu âm?',
          buttons: [
            {
              text: 'Có',
              buttonStyle: CFAlertActionStyle.POSITIVE,
              textColor: '#fff',
              backgroundColor: '#ff4757',
              onClick: function(response) {
                if (self.$recorder.isRecording()) {
                  self.$recorder.stop();
                }

                localstorage.setNumber('activeUserId', 0);
                return self.$navigateTo(HomePage, { clearHistory: true });
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
        break;
    }

    this.dialog.show(options);
  }
}
</script>

<style scoped lang="scss">
.intro-text {
  font-size: 18;
}
.script_content {
  font-size: 26;
  color: #2f3542;
  text-align: center;
  background-color: #fff8f8;
}
.btn {
  border-radius: 100;
  &.fa {
    font-size: 40;
  }
  .exit {
    color: #2f3542;
  }
}
.start-btn {
  background-color: #ff4757;
  color: #fff;
}
.stop-btn {
  background-color: #fff;
  color: #ff4757;
  &.fa {
    font-size: 60;
  }
  border-width: 2;
  border-color: #ff4757;
}
</style>
