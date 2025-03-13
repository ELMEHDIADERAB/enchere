/*import axios from 'axios';

const API_BASE_URL = 'http://localhost:8083/api';

const apiService = {
    get(url, options = {}) {
        const token = localStorage.getItem('token');
      if(token){
            options.headers = {
                ...options.headers,
                Authorization: `Bearer ${token}`,
            }
         }
       return axios.get(API_BASE_URL + url, options);
    },
    post(url, data, options = {}) {
       const token = localStorage.getItem('token');
       if(token){
             options.headers = {
               ...options.headers,
                Authorization: `Bearer ${token}`,
            }
        }
      return axios.post(API_BASE_URL + url, data, options);
   },
   put(url, data, options = {}) {
       const token = localStorage.getItem('token');
     if(token){
          options.headers = {
               ...options.headers,
             Authorization: `Bearer ${token}`,
           }
       }
     return axios.put(API_BASE_URL + url, data, options);
  },
    delete(url, options = {}) {
       const token = localStorage.getItem('token');
        if(token){
            options.headers = {
               ...options.headers,
                 Authorization: `Bearer ${token}`,
            }
        }
       return axios.delete(API_BASE_URL + url, options);
    },
};

export default apiService;*/
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8083/api';

const apiService = {
    get(url, options = {}) {
        const token = localStorage.getItem('token');
      if(token){
            options.headers = {
                ...options.headers,
                Authorization: `Bearer ${token}`,
            }
           console.log('Headers sent with get request:', options.headers);
         }
       return axios.get(API_BASE_URL + url, options);
    },
    post(url, data, options = {}) {
       const token = localStorage.getItem('token');
       if(token){
             options.headers = {
               ...options.headers,
                Authorization: `Bearer ${token}`,
            }
            console.log('Headers sent with post request:', options.headers);
            console.log('Parameters sent with post request:', options.params);

        }
      return axios.post(API_BASE_URL + url, data, options);
   },
   put(url, data, options = {}) {
       const token = localStorage.getItem('token');
     if(token){
          options.headers = {
               ...options.headers,
             Authorization: `Bearer ${token}`,
           }
           console.log('Headers sent with put request:', options.headers);
       }
     return axios.put(API_BASE_URL + url, data, options);
  },
    delete(url, options = {}) {
       const token = localStorage.getItem('token');
        if(token){
            options.headers = {
               ...options.headers,
                 Authorization: `Bearer ${token}`,
            }
            console.log('Headers sent with delete request:', options.headers);
        }
       return axios.delete(API_BASE_URL + url, options);
    },
};

export default apiService;