import { Action, Mutation, Module, VuexModule } from 'vuex-module-decorators';
import config from '@/config';
import fetch from '@/utils/fetch';

@Module
export default class Events extends VuexModule {
  data: any = [];

  @Mutation SET_EVENTS(data) {
    this.data = data[0].data;
  }

  @Action({ commit: 'SET_EVENTS' })
  get_events() {
    return fetch({
      url: '/api/v1/apps/listevent',
      method: 'GET',
      headers: {
        'Cache-Control': 'no-cache'
      }
    }).then(response => {
      return response.data;
    });
  }
}
