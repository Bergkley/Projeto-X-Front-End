import api from './api';

class ServiceAUTH {
  login(data) {
    return api.post(`/user/login`, data);
  }

  register(data) {
    return api.post(`/user/register`, data);
  }

  forgotPassword(data) {
    return api.patch(`/user/forgot-password`, data);
  }

  getFindQuestionByUser(data){
    const queryParam = encodeURIComponent(data);
    return api.get(`/user/find-questions?login=${queryParam}`);
  
  }

  getByUser(id){
    return api.get(`/user/find-user/${id}`);
  }

  editUser(id, data){
    return api.put(`/user/edit/${id}`, data);
  }

  deleteUser(id){
    return api.delete(`/user/delete/${id}`);
  }
  
}

export default new ServiceAUTH();
