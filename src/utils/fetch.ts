import axios from 'axios';
import config from '@/config';

const service = axios.create({
  baseURL: config.apiUrl,
  timeout: 9000000
})

// request
service.interceptors.request.use(
  config => {
    return config
  },
  error => {
    Promise.reject(error)
  }
)

// respone
service.interceptors.response.use(
  response => response,
  error => {
    if (error.response.data.status !== 500) {
      console.dir(error.response.data.message);
    }

    return Promise.reject(error);
  }
)

export default service
