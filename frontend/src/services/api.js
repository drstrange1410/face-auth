import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

export const userService = {
  async getAllUsers() {
    const response = await axios.get(`${API_URL}/users`);
    return response.data;
  },

  async getUser(id) {
    const response = await axios.get(`${API_URL}/users/${id}`);
    return response.data;
  },

  async createUser(userData) {
    const response = await axios.post(`${API_URL}/users`, userData);
    return response.data;
  },

  async updateUser(id, userData) {
    const response = await axios.put(`${API_URL}/users/${id}`, userData);
    return response.data;
  },

  async deleteUser(id) {
    const response = await axios.delete(`${API_URL}/users/${id}`);
    return response.data;
  },
};
