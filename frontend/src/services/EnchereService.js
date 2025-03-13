import axios from "axios";

const REST_API_BASE_URL = 'http://localhost:8083/api/admin/encheres/';

export const listEncheres = () => axios.get(REST_API_BASE_URL);

///export const getEnchere = (id) => axios.get(`${REST_API_BASE_URL}${id}`);

export const getEnchere = (id) => axios.get(`http://localhost:8083/api/admin/encheres/${id}`);
  
