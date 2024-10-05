import axios from 'axios';
import Cookies from 'js-cookie';
import config from '../config';

const API_URL = 'http://localhost:3001/api'; // Thay thế bằng URL API thực tế của bạn

export const login = async (email, password) => {
  try {
    const response = await axios.post(`${API_URL}/users/login`, { email, password });
    if (response.data.data.token) {
      Cookies.set('UserToken', response.data.data.token, { expires: 7 });
      Cookies.set('user', JSON.stringify(response.data.data.user), { expires: 7 });
      // Kích hoạt sự kiện loginStatusChanged
      window.dispatchEvent(new Event('loginStatusChanged'));
    }
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const logout = () => {
  Cookies.remove('UserToken');
  Cookies.remove('user');
  // Kích hoạt sự kiện loginStatusChanged
  window.dispatchEvent(new Event('loginStatusChanged'));
};

export const getCurrentUser = () => {
  const userString = Cookies.get('user');
  // console.log('User string from cookie:', userString);
  if (userString) {
    try {
      return JSON.parse(userString);
    } catch (error) {
      console.error('Error parsing user data:', error);
      return null;
    }
  }
  return null;
};

export const isAuthenticated = () => {
  const token = Cookies.get('UserToken');
  return !!token;
};

export const GET_USER_BY_ID = (userId) => `/users/getuser/${userId}`; // Thay đổi API để lấy thông tin người dùng theo ID

export const getUserById = async (userId) => {
  try {
    const response = await axios.get(`${config.API_BASE_URL}${config.USER_API.GET_USER_BY_ID}/${userId}`);
    return response.data.data.user;
  } catch (error) {
    console.error('Lỗi khi lấy thông tin người dùng:', error);
    throw error;
  }
};

export const loginAdmin = async (email, password) => {
  try {
    const response = await axios.post(`${API_URL}/admin/login`, { email, password });
    if (response.data.data.token) {
      Cookies.set('AdminToken', response.data.data.token, { expires: 7 });
      Cookies.set('admin', JSON.stringify(response.data.data.user), { expires: 7 });
      window.dispatchEvent(new Event('loginStatusChanged'));
    }
    return response.data;
  } catch (error) {
    throw error;
  }
};
