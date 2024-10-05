const API_BASE_URL = 'http://localhost:3001/api';

export default {
  API_BASE_URL,
  USER_API: {
    LOGOUT: `${API_BASE_URL}/users/logout`,
    REGISTER: `${API_BASE_URL}/users/register`,
    LOGIN: `${API_BASE_URL}/users/login`,
    UPDATE: `${API_BASE_URL}/users/update`,
    CHANGE_PASSWORD: `${API_BASE_URL}/users/change-password`,
    GET_INFO: `${API_BASE_URL}/users/me`,
    GET_SERVICES: `${API_BASE_URL}/users/services`,
    CANCEL_SERVICE: `${API_BASE_URL}/users/cancel-service`,
    FORGOT_PASSWORD: `${API_BASE_URL}/users/forgot-password`,
    UPDATE_AVATAR: '/users/update-avatar', // Thêm endpoint này
    GET_USER_BY_ID: '/users/getuser',
  },
  ADMIN_API: {
    GET_ALL_USERS: `${API_BASE_URL}/users/all`,
    DELETE_USER: `${API_BASE_URL}/admin/users`,
  },
  THE_SAND_API: {
    GET_ALL_SHOP: `${API_BASE_URL}/thesand/allshop`,
    ADD_SHOP: `${API_BASE_URL}/thesand/addshop`,
    UPDATE_SHOP: `${API_BASE_URL}/thesand/updateshop`,
    DELETE_SHOP: `${API_BASE_URL}/thesand/deleteshop`,
  },
  MAP_API: {
    GET_ALL_MAP: `${API_BASE_URL}/map/getall`,
    ADD_MAP: `${API_BASE_URL}/map/add`,
    UPDATE_MAP: `${API_BASE_URL}/map/updatemap`,
    DELETE_MAP: `${API_BASE_URL}/map/deletemap`,
  },
  ORDER_API: {
    GET_ALL_ORDER: `${API_BASE_URL}/orders/all`,
    GET_ORDER_BY_USER_ID: `${API_BASE_URL}/orders/user`,
    GET_ORDER_BY_ID: `${API_BASE_URL}/orders/`,
    GET_ORDER_BY_SERVICE_NAME: `${API_BASE_URL}/orders/`,
    ADD_ORDER: `${API_BASE_URL}/orders/add`,
    UPDATE_ORDER: `${API_BASE_URL}/orders/update`,
    DELETE_ORDER: `${API_BASE_URL}/orders/delete`,
  },
  IS_API: {
    GET_ALL_IS: `${API_BASE_URL}/is/getall`,
    GET_IS_BY_ID: `${API_BASE_URL}/is/getbyid`,
    ADD_IS: `${API_BASE_URL}/is/add`,
    UPDATE_IS: `${API_BASE_URL}/is/update`,
    DELETE_IS: `${API_BASE_URL}/is/delete`,
  }
};