<template>
  <Page class="page">
    <ActionBar class="action-bar" title="Lịch sử thu">
      <NavigationButton android.systemIcon="ic_menu_back" @tap="onGoSetting"/>
    </ActionBar>
    <ActivityIndicator :busy="loading" />
    <ListView for="voice in myVoices" separatorColor="#fff" class="m-8" v-if="myVoices.length > 0">
      <v-template>
        <GridLayout rows="*" columns="*" class="item" :backgroundColor="$odd ? '#fff' : '#fff8f8'">
          <GridLayout rows="*,*" columns="4*,*">
            <StackLayout row="0" col="0" orientation="horizontal">
              <Label marginRight="8">
                <FormattedString>
                  <Span
                    :text="`${voice.status} `"
                    fontSize="12"
                    :color="voice.status === 'in_local' ? '#ffa502' : '#2ed573'">
                  </Span>
                </FormattedString>
              </Label>
              <Label marginRight="8">
                <FormattedString>
                  <Span class="fa" :text="'fa-phone' | fonticon" fontSize="12" color="#ff4757"></Span>
                  <Span :text="` ${voice.mobilenumber}`" fontSize="12"></Span>
                </FormattedString>
              </Label>
              <Label>
                <FormattedString>
                  <Span class="fa" :text="'fa-clock-o' | fonticon" fontSize="11" color="#ff4757"></Span>
                  <Span :text="` ${voice.datecreated}`" fontSize="11"></Span>
                </FormattedString>
              </Label>
            </StackLayout>
            <StackLayout row="1" col="0" class="m-t-5">
              <Label textWrap="true">
                <FormattedString>
                  <Span :text="`#${voice.cloudid} `" fontWeight="bold" fontSize="12"></Span>
                  <Span :text="voice.text" fontSize="12"></Span>
                </FormattedString>
              </Label>
            </StackLayout>
            <StackLayout row="0" col="1" rowSpan="2" verticalAlignment="center">
              <Button class="fa" :text="'fa-headphones'|fonticon" @tap="togglePlay(`${audioFolder.path}/${voice.filepath}`)" color="#ff4757" ></Button>
            </StackLayout>
          </GridLayout>
        </GridLayout>
      </v-template>
    </ListView>
    <StackLayout v-else verticalAlignment="center">
      <Label class="fa" :text="'fa-microphone' | fonticon" fontSize="80" horizontalAlignment="center" color="#ddd"></Label>
      <Label text="Chưa có dữ liệu" horizontalAlignment="center" color="#ddd"></Label>
    </StackLayout>
  </Page>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import { Action, State } from 'vuex-class';
import { TNSPlayer } from 'nativescript-audio';
import * as fs from 'tns-core-modules/file-system';
import SettingPage from '@/pages/Setting.vue';

@Component
export default class HistoryPage extends Vue {
  @State(state => state.voices.data) myVoices;
  @Action('get_voices') getVoicesAction;

  player: any;
  loading: boolean = false;
  audioFolder: any;

  constructor() {
    super();
    this.player = new TNSPlayer();
    this.audioFolder = fs.knownFolders.documents().getFolder('audio');
  }

  togglePlay(filepath) {
    if (this.player.isAudioPlaying()) {
      this.player.dispose()
        .then(() => {
          this._play(filepath);
        })
    } else {
      this._play(filepath);
    }
  }

  onGoSetting() {
    this.$navigateTo(SettingPage);
  }

  mounted() {
    console.log('HISTORY MOUNTED')
    this.loading = true;

    this.getVoicesAction()
      .then(() => {
        this.loading = false;

      });
  }

  _play(filepath) {
    console.log('PLAY FILE: ' + filepath)
    const self = this;

    const playerOptions = {
      audioFile: filepath,
      loop: false
    };

    this.player.playFromFile(playerOptions);
  }
}
</script>

<style scoped>
.item {
  margin: 5 0 5 0;
  padding: 5 0 0 0;
}

</style>
