import api from './api';

class ServiceUSERS {
 
  getByUser(id){
    return api.get(`/user/find-user/${id}`);
  }

  editUser(id, data){
    return api.patch(`/user/edit/${id}`, data);
  }

  deleteUser(id){
    return api.delete(`/user/delete/${id}`);
  }
  
}

export default new ServiceUSERS();
