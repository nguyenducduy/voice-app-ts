<template>
  <StackLayout>
    <StackLayout height="70%" verticalAlignment="center">
      <Label :text="countRemainning" horizontalAlignment="center" class="display_number"></Label>
    </StackLayout>
    <StackLayout height="30%">
      <Label text="câu cần thu" horizontalAlignment="center" class="display_desc"></Label>
    </StackLayout>
  </StackLayout>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import { State } from 'vuex-class';

@Component
export default class CountUploaded extends Vue {
  @State(state => state.scripts.totalItems) totalScripts;
  @State(state => state.voices.totalRecordedLocalItems) totalRecorded;

  get countRemainning() {
    return this.totalScripts - this.totalRecorded;
  }
}
</script>

<style scoped>
.display_number {
  font-size: 50;
  color: #ff4757;
  font-family: "CrashNumberingGothic";
}
.display_desc {
  color: #57606f;
}
</style>
