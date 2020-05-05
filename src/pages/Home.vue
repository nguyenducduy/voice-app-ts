<template>
  <Page backgroundSpanUnderStatusBar="true" backgroundColor="#151F2F">
    <GridLayout >
      <GridLayout id="intro-background" class="intro-background-intro" originY="0"/>
      <GridLayout id="intro-logo-bg" class="intro-logo-bg-intro" backgroundColor="#ff4757" width="93" height="93" horizontalAlignment="center" verticalAlignment="center" borderRadius="20" />
      <GridLayout id="intro-logo-n" class="intro-logo-n-intro" backgroundImage="res://logo_bg" width="93" height="93" horizontalAlignment="center" verticalAlignment="center" />
      <GridLayout id="intro-logo-ns" class="intro-logo-ns-intro" backgroundImage="res://logo_text" width="257" height="29" horizontalAlignment="center" verticalAlignment="center" margin="160 0 0 0" />

      <Label id="intro-text-one"
        class="intro-text-one-intro"
        text="Ứng dụng thu âm giọng nói"
        fontSize="37"
        horizontalAlignment="center"
        verticalAlignment="center"
        textWrap="true"
        color="white"
        textAlignment="center" />
      <Label id="intro-text-two"
        class="intro-text-two-intro"
        text="OLLI Technology"
        fontSize="19"
        horizontalAlignment="center"
        verticalAlignment="center"
        textWrap="true"
        color="#8DA1AB"
        textAlignment="center" />
      <Button id="intro-get-started"
        class="intro-get-started-intro"
        text="Bắt đầu"
        backgroundColor="#ff4757"
        color="white"
        borderRadius="25"
        height="50"
        width="234"
        fontSize="18"
        @tap="onStart" />
      <Label id="intro-version"
        class="intro-version-intro"
        text="Thiết lập"
        fontSize="14"
        horizontalAlignment="center"
        verticalAlignment="center"
        color="white"
        textAlignment="center"
        height="50"
        width="234"
        @tap="onGoSetting" />
    </GridLayout>
  </Page>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
const localstorage = require('application-settings');
import RecordPage from '@/pages/Record.vue';
import UserPage from '@/pages/User.vue';
import SettingPage from '@/pages/Setting.vue';

@Component
export default class HomePage extends Vue {
  onStart() {
    const uid = localstorage.getNumber('activeUserId');

    if (typeof uid !== 'undefined' && uid > 0) {
      this.$navigateTo(RecordPage, { clearHistory: true });
    } else {
      this.$navigateTo(UserPage);
    }
  }

  onGoSetting() {
    this.$navigateTo(SettingPage);
  }
}

</script>

<style scoped lang="css">
.intro-text-one-intro {
  animation-name: intro-text-one-intro;
  animation-duration: 2;
  animation-fill-mode: forwards;
  animation-iteration-count: 1;
  animation-timing-function: cubic-bezier(0.25, 0.1, 0.25, 1);
}
.intro-text-two-intro {
    animation-name: intro-text-two-intro;
    animation-duration: 2;
    animation-fill-mode: forwards;
    animation-iteration-count: 1;
    animation-timing-function: cubic-bezier(0.25, 0.1, 0.25, 1);
}
.intro-get-started-intro {
    animation-name: intro-get-started-intro;
    animation-duration: 2;
    animation-fill-mode: forwards;
    animation-iteration-count: 1;
    animation-timing-function: cubic-bezier(0.25, 0.1, 0.25, 1);
}
.intro-background-intro {
    background-color: #151F2F;
}
.intro-version-intro {
    animation-name: intro-version-intro;
    animation-duration: 2;
    animation-fill-mode: forwards;
    animation-iteration-count: 1;
    animation-timing-function: cubic-bezier(0.25, 0.1, 0.25, 1);
}
.intro-logo-bg-intro {
    animation-name: intro-logo-bg-intro;
    animation-duration: 2;
    animation-fill-mode: forwards;
    animation-iteration-count: 1;
    animation-timing-function: cubic-bezier(0.25, 0.1, 0.25, 1);
}
.intro-logo-n-intro {
    animation-name: intro-logo-n-intro;
    animation-duration: 2;
    animation-fill-mode: forwards;
    animation-iteration-count: 1;
    animation-timing-function: cubic-bezier(0.25, 0.1, 0.25, 1);
}
.intro-logo-ns-intro {
    animation-name: intro-logo-ns-intro;
    animation-duration: 2;
    animation-fill-mode: forwards;
    animation-iteration-count: 1;
    animation-timing-function: cubic-bezier(0.25, 0.1, 0.25, 1);
}
.intro-logo-bg-enter {
    animation-name: intro-logo-bg-enter;
    animation-duration: 0.25;
    animation-fill-mode: forwards;
    animation-iteration-count: 1;
    animation-timing-function: cubic-bezier(0.25, 0.1, 0.25, 1);
}
.intro-logo-n-enter {
    animation-name: intro-logo-n-enter;
    animation-duration: 0.25;
    animation-fill-mode: forwards;
    animation-iteration-count: 1;
    animation-timing-function: cubic-bezier(0.25, 0.1, 0.25, 1);
}
.intro-logo-ns-enter {
    animation-name: intro-logo-ns-enter;
    animation-duration: 0.25;
    animation-fill-mode: forwards;
    animation-iteration-count: 1;
    animation-timing-function: cubic-bezier(0.25, 0.1, 0.25, 1);
}
</style>
