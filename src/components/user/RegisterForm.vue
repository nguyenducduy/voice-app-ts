<template>
  <PreviousNextView>
    <ScrollView orientation="vertical" scrollBarIndicatorVisible="false">
      <StackLayout class="form" orientation="vertical">
        <StackLayout class="input-field" orientation="vertical">
          <Label text="Tên" class="label font-weight-bold m-b-5" color="#333" />
          <TextField class="input"
            v-model="form.fullname"/>
          <StackLayout class="hr-light"></StackLayout>
        </StackLayout>
        <StackLayout class="input-field">
          <StackLayout orientation="horizontal" class="m-b-5">
            <Label text="Số điện thoại " class="label font-weight-bold" color="#333" />
            <Label text="*" class="required"></Label>
          </StackLayout>
          <TextField class="input" keyboardType="phone"
            v-model="form.mobilenumber" />
          <StackLayout class="hr-light"></StackLayout>
        </StackLayout>
        <StackLayout class="input-field">
          <StackLayout orientation="horizontal" class="m-b-5">
            <Label text="Email " class="label font-weight-bold" color="#333" />
            <Label text="*" class="required"></Label>
          </StackLayout>
          <TextField class="input" keyboardType="email"
            v-model="form.email" />
          <StackLayout class="hr-light"></StackLayout>
        </StackLayout>
        <StackLayout class="input-field">
          <Label text="Tuổi" class="label font-weight-bold m-b-5" color="#333" />
          <TextField class="input" keyboardType="phone" maxLength="2"
            v-model="form.age" />
          <StackLayout class="hr-light"></StackLayout>
        </StackLayout>
        <StackLayout class="input-field">
          <Label text="Giới tính" class="label font-weight-bold m-b-10" color="#333" />
          <CheckBox
            :key="index"
            v-for="(opt, index) in genderOpts"
            :text="opt.text"
            :checked="opt.selected"
            class="m-b-15"
            @checkedChange="(args) => { args.object.checked !== opt.selected && changeCheckedGender(opt) }"
            @tap="changeCheckedGender(opt)"
            boxType="circle" />
        </StackLayout>
        <StackLayout class="input-field">
          <StackLayout orientation="horizontal" class="m-b-5">
            <Label text="Tỉnh thành " class="label font-weight-bold m-b-5" color="#333" />
            <Label text="*" class="required"></Label>
          </StackLayout>>
          <Label class="m-b-30 fa"
            @tap="onShowRegionModal"
            height="28">
            <FormattedString>
              <Span :text="form.region !== null ? `${form.region.title}   ` : 'Chọn tỉnh thành   '"></Span>
              <Span class="fa" :text="'fa-angle-down'|fonticon" fontSize="20"></Span>
            </FormattedString>
          </Label>
        </StackLayout>
        <Button class="m-t-50"
          text="Tiếp tục"
          backgroundColor="#ff4757"
          color="#fff"
          borderRadius="25"
          height="50"
          width="234"
          fontSize="18"
          @tap="onNext" />
      </StackLayout>
    </ScrollView>
  </PreviousNextView>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import { Action, State } from 'vuex-class';
import { Feedback } from 'nativescript-feedback';
import RegionModal from './RegionModal.vue';
import RecordPage from '@/pages/Record.vue';

@Component
export default class RegisterForm extends Vue {
  @Action('add_user') addUserAction;

  feedback: any = null;
  loading: boolean = false;
  genderOpts: any = [
    { text: 'Nam', selected: false, value: 1 },
    { text: 'Nữ', selected: false, value: 3 },
  ];
  form: any = {
    fullname: '',
    mobilenumber: '',
    email: '',
    age: '',
    gender: '',
    region: null
  };

  constructor() {
    super();
    this.feedback = new Feedback();
  }

  changeCheckedGender(opt) {
    opt.selected = !opt.selected;
    this.form.gender = opt.value;

    if (!opt.selected) {
      return;
    }

    // uncheck all other options
    this.genderOpts.forEach(option => {
      if (option.text !== opt.text) {
        option.selected = false;
      }
    });
  }

  onShowRegionModal() {
    const self = this;

    this.$showModal(RegionModal)
      .then(data => {
        self.form.region = data;
      });
  }

  onNext() {
    const self = this;

    if (typeof this.form.mobilenumber === 'undefined' || this.form.mobilenumber.length === 0) {
      this.feedback.error({
        message: "Số điện thoại không được trống"
      });
      return;
    }

    const phoneFilter = /^([0-9]{10,11})$/;
    if (!phoneFilter.test(this.form.mobilenumber)) {
      this.feedback.error({
        message: "Số điện thoại không hợp lệ"
      });
      return;
    }

    if (typeof this.form.email === 'undefined' || this.form.email.length === 0) {
      this.feedback.error({
        message: "Email không được trống"
      });
      return;
    }

    const emailFilter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    if (!emailFilter.test(this.form.email)) {
      this.feedback.error({
        message: "Email không hợp lệ"
      });
      return;
    }

    if (typeof this.form.region === 'undefined' || this.form.region === null) {
      this.feedback.error({
        message: "Tỉnh thành không được trống"
      });
      return;
    }

    this.addUserAction(Object.assign({}, this.form))
        .then(() => {
          return self.$navigateTo(RecordPage, { clearHistory: true });
        });
  }
}
</script>

<style>
TextField {
  height: 28;
}
CheckBox {
  font-size: 18;
  color: #333;
}
.required {
  color: #ff0000;
  font-size: 15;
}
</style>
