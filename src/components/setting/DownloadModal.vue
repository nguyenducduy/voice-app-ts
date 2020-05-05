<template>
  <Page actionBarHidden="true" backgroundSpanUnderStatusBar="true" backgroundColor="#ff4757">
    <Gradient direction="to bottom" colors="#ff4757, #fff8f8" class="container">
      <GridLayout rows="*,2*">
        <StackLayout row="0" @tap="onClose"></StackLayout>
        <StackLayout row="1" backgroundColor="white" class="modal_body">
          <GridLayout rows="auto, *">
            <StackLayout row="0" height="50" @tap="onClose" class="modal_header">
              <Button horizontalAlignment="right" @tap="onClose">
                <FormattedString>
                  <Span :text="count > 0 ? `Đang tải ${count} câu | ` : ``" fontSize="14" color="#333"></Span>
                  <Span text="Đóng  " fontSize="18" color="#333"></Span>
                  <Span class="fa" :text="'fa-angle-down' | fonticon" fontSize="25" color="#333"></Span>
                </FormattedString>
              </Button>
            </StackLayout>
            <StackLayout row="1" class="modal_content">
              <ScrollView orientation="vertical">
                <StackLayout orientation="vertical">
                  <Button :text="tag.name" class="tag_item" v-for="tag in myTags" @tap="onChoose(tag)" color="#333"/>
                </StackLayout>
              </ScrollView>
            </StackLayout>
          </GridLayout>
        </StackLayout>
      </GridLayout>
    </Gradient>
  </Page>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import { Action, State } from 'vuex-class';
import { Feedback } from 'nativescript-feedback';
import { LoadingIndicator } from 'nativescript-loading-indicator';

@Component
export default class DownloadModal extends Vue {
  @State(state => state.scripts.tags) myTags;
  @State(state => state.scripts.data) myScripts;
  @Action('get_script_tags') getTagsAction;
  @Action('download_scripts') downloadScriptAction;
  @Action('change_status') changeStatusAction;

  feedback: any = null;
  count: number = 0;
  loader: any;

  constructor() {
    super();
    this.feedback = new Feedback();
    this.loader = new LoadingIndicator();
  }

  onClose() {
    this.$modal.close(null);
  }

  onChoose(tag) {
    const self = this;
    this.loader.show();

    // Download new script in this tag
    this.downloadScriptAction(tag.name)
      .then(() => {
        if (self.myScripts.length > 0) {
          const multi_promise = self.myScripts.map(script => {
            self.count++;
            return self.changeStatusAction({ id: script.id, status: 'downloaded' });
          })

          Promise.all(multi_promise).then(function(results) {
            self.loader.hide();
            self.$modal.close();
            self.count = 0;
          })

        } else {
          self.loader.hide();

          this.feedback.info({
            message: "Không có script mới"
          });
        }
      })
  }

  created() {
    this.loader.show();

    this.getTagsAction().then(() => { this.loader.hide(); });
  }
}
</script>

<style scoped>
.modal_header {
  padding: 15;
}
.modal_body {
  border-top-left-radius: 15;
  border-top-right-radius: 15;
}
.modal_content {
  padding: 0 20 20 20;
}
.tag_item {
  height: 40;
  background-color: #fff8f8;
  border-radius: 5;
  margin-bottom: 8;
  padding: 10;
}
</style>
