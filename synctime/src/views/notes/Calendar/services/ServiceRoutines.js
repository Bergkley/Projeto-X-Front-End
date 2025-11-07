import api from "../../../../services/api";

class ServiceRoutines {
  getByAllRoutines() {
    const params = new URLSearchParams();
    

    return api.get(`/routines/userId?${params.toString()}`, {
      params: { isCalendar: true },
    });
  }
  getByIdRoutines(id) {
    return api.get(`/routines/${id}`);
  }

  createRoutines(data) {
    return api.post(`/routines/create`, data);
  }

  editRoutines(id, data) {
    return api.patch(`/routines/edit/${id}`, data);
  }

  deleteRoutines(id) {
    return api.delete(`/routines/delete/${id}`);
  }
}

export default new ServiceRoutines();
