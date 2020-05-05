<template>
  <Page class="page">
    <ActionBar class="action-bar" title="Người thu">
      <NavigationButton android.systemIcon="ic_menu_back" @tap="$router.push('/home')" />
    </ActionBar>
    <register-form></register-form>
  </Page>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import RegisterForm from '@/components/user/RegisterForm.vue';

@Component({
  components: {
    RegisterForm
  }
})
export default class UserPage extends Vue {

}
</script>
