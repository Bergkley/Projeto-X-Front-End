import api from './api';

class ServiceUSERS {
 
  getByUser(id){
    return api.get(`/user/find-user/${id}`);
  }

  getPresence(month = null, year = null){
    const params = new URLSearchParams({
      month: month !== null ? month : (new Date().getMonth() + 1),
      year: year !== null ? year : new Date().getFullYear()
    });
    return api.get(`/user/get-presence?${params.toString()}`);
  }

  getStreak(){
    return api.get(`/user/get-streak`);
  }

  editUser(id, data){
    return api.patch(`/user/edit/${id}`, data);
  }

  deleteUser(id){
    return api.delete(`/user/delete/${id}`);
  }
  
}

export default new ServiceUSERS();
