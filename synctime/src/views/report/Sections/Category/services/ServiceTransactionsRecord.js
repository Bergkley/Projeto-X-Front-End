import api from '../../../../../services/api';
class ServiceTransactionsRecord {
  getByAllTransactionsRecord(sortBy = '', order = '', filters = [], monthlyRecordId) {
    const params = new URLSearchParams();
   

    if (filters && filters.length > 0) {
      params.append('filters', JSON.stringify(filters));
    }

    return api.get(`/transactions/userId?${params.toString()}`, {
      params: { sortBy, order, monthlyRecordId }
    });
  }
  getByIdTransactionsRecord(id) {
    return api.get(`/transactions/${id}`);
  }

  createTransactionsRecord(data) {
    return api.post(`/transactions/create`, data);
  }

  editTransactionsRecord(id, data) {
    console.log('editServiceTransactionsRecord', id, data);
    return api.patch(`/transactions/edit/${id}`, data);
  }

  deleteTransactionsRecord(id) {
    return api.delete(`/transactions/delete/${id}`);
  }
}

export default new ServiceTransactionsRecord();
