<template>
  <StackLayout>
    <StackLayout height="70%" verticalAlignment="center">
      <Label :text="total" horizontalAlignment="center" class="display_number"></Label>
    </StackLayout>
    <StackLayout height="30%">
      <Label text="câu đã tải lên" horizontalAlignment="center" class="display_desc"></Label>
    </StackLayout>
  </StackLayout>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import { Action, State } from 'vuex-class';

@Component
export default class CountUploaded extends Vue {
  @State(state => state.voices.totalItemUploaded) total;
  @Action('count_voice_uploaded') countVoiceUploadedAction;

  mounted() {
    this.countVoiceUploadedAction();
  }
}
</script>

<style scoped>
.display_number {
  font-size: 50;
  color: #2ed573;
  font-family: "CrashNumberingGothic";
}
.display_desc {
  color: #57606f;
}
</style>
