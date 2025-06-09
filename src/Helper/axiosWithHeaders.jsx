import axios from 'axios';
import Cookies from 'js-cookie';

const axiosWithHeaders = axios.create();

axiosWithHeaders.interceptors.request.use(
  (config) => {
    const token = Cookies.get('token') || null;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosWithHeaders.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      Cookies.remove('token');
          Cookies.remove('is_admin_for_welltel');
          Cookies.remove("is_admin");
          Cookies.remove("SelectedAgency");
          localStorage.clear();
          window.location.reload()
          window.location.replace('/login')
    }
    return Promise.reject(error);
  }
);

export default axiosWithHeaders;