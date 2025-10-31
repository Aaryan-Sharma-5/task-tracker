import api from './api';

const taskService = {
  getTasks: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const response = await api.get(`/tasks?${queryString}`);
    return response.data;
  },

  getTask: async (id) => {
    const response = await api.get(`/tasks/${id}`);
    return response.data;
  },

  createTask: async (taskData) => {
    const response = await api.post('/tasks', taskData);
    return response.data;
  },

  updateTask: async (id, taskData) => {
    const response = await api.put(`/tasks/${id}`, taskData);
    return response.data;
  },

  deleteTask: async (id) => {
    const response = await api.delete(`/tasks/${id}`);
    return response.data;
  },

  getStats: async () => {
    const response = await api.get('/tasks/stats/summary');
    return response.data;
  }
};

export default taskService;
