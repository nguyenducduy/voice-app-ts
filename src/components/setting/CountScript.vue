<template>
  <StackLayout class="container">
    <StackLayout height="70%" verticalAlignment="center">
      <Label :text="total" horizontalAlignment="center" class="display_number"></Label>
    </StackLayout>
    <StackLayout height="30%">
      <Label text="câu đã tải" horizontalAlignment="center" class="display_desc"></Label>
    </StackLayout>
  </StackLayout>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import { Action, State } from 'vuex-class';

@Component
export default class CountScript extends Vue {
  @State(state => state.scripts.totalItems) total;
  @Action('count_script_all') countScriptAllAction;

  mounted() {
    this.countScriptAllAction();
  }
}
</script>

<style scoped>
.display_number {
  font-size: 50;
  color: #ffa502;
  font-family: "CrashNumberingGothic";
}
.display_desc {
  color: #57606f;
}
</style>
