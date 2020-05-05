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
                  <Span text="Đóng  " fontSize="18" color="#333"></Span>
                  <Span class="fa" :text="'fa-angle-down' | fonticon" fontSize="25" color="#333"></Span>
                </FormattedString>
              </Button>
            </StackLayout>
            <StackLayout row="1" class="modal_content">
              <ActivityIndicator :busy="loading" marginBottom="10"/>
              <ScrollView orientation="vertical">
                <StackLayout orientation="vertical">
                  <Button :text="event.name" class="tag_item" v-for="event in myEvents" @tap="onChoose(event)" color="#333">
                    <FormattedString>
                      <Span :text="`${event.name}   `"></Span>
                    </FormattedString>
                  </Button>
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
const localstorage = require('tns-core-modules/application-settings');

@Component
export default class EventModal extends Vue {
  @State(state => state.events.data) myEvents;
  @Action('get_events') getEventsAction;

  loading: boolean = false;

  onClose() {
    this.$modal.close(null);
  }

  onChoose(event) {
    localstorage.setString('activeEvent', JSON.stringify(event));

    this.$modal.close(event);
  }

  mounted() {
    const self = this;
    this.loading = true;

    this.getEventsAction()
      .then(() => {
        self.loading = false;
      });
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
