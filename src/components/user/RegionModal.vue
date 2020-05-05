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
              <!-- <TextField class="input" hint="Hồ Chí Minh, Hà Nội, ..." v-model="regionFilterName" @textChange="onFilter" /> -->
              <ListView for="region in regions" @itemTap="onItemTap" separatorColor="transparent" >
                <v-template>
                  <Label :text="region.title" class="item" />
                </v-template>
              </ListView>
            </StackLayout>
          </GridLayout>
        </StackLayout>
      </GridLayout>
    </Gradient>
  </Page>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import config from '@/config';

@Component
export default class RegionModal extends Vue {
  regions: any = {};
  regionSelected: object = {};
  regionFilterName: string = '';

  onItemTap(region) {
    this.$modal.close(region.item);
  }

  onClose() {
    this.$modal.close(null);
  }

  mounted() {
    this.regions = config.regions;
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
  background-color: #fff;
}
.item {
  height: 40;
  background-color: #fff;
  border-radius: 5;
  margin-bottom: 8;
  padding: 10;
}
.input {
  border-width: 1;
  border-color: #ff4757;
  border-radius: 25;
  margin: 10;
  padding: 10;
  background-color: #fff;
  height: 40;
}
</style>
