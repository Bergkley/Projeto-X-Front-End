import api from "../../../services/api";

class ServiceNotification {
  getByAllNotification() {
    const params = new URLSearchParams();
    params.append("order", "DESC");
    return api.get(`/notification/userId?${params.toString()}`, {
      params: { isListAll: true },
    });
  }
  getByIdNotification(id) {
    return api.get(`/notification/${id}`);
  }


  markReadNotification(ids) {
    return api.patch(`/notification/mark-read`, ids);
  }

  deleteNotification(ids) {
    return api.post(`/notification/delete`,ids);
  }
}

export default new ServiceNotification();
