// ⚙️ React e bibliotecas externas
import { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';

// 🔐 Serviços / API
import api from '../services/api';
import ServiceAUTH from '../services/ServiceAUTH';

// 🧠 Hooks customizados
import useFlashMessage from './userFlashMessage';
import {
  useMemorizeFilters,
  POSSIBLE_FILTERS_ENTITIES
} from './useMemorizeInputsFilters';

export default function useAuth() {
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const history = useHistory();
  const { setFlashMessage } = useFlashMessage();
  const {
    getMemorizedFilters: getMemorizedFiltersUsers,
    memorizeFilters: memorizeFiltersUsers,
    clearMemorizedFilters: clearMemorizedFiltersUsers
  } = useMemorizeFilters(POSSIBLE_FILTERS_ENTITIES.USERS);
  const {
    getMemorizedFilters: getMemorizedFiltersSystem,
    memorizeFilters: memorizeFiltersSystem
  } = useMemorizeFilters(POSSIBLE_FILTERS_ENTITIES.SYSTEM_CONFIG);

  async function validateToken() {
    const token = localStorage.getItem('token');
    
    if (!token) {
      setAuthenticated(false);
      setLoading(false);
      return false;
    }

    try {
      api.defaults.headers.Authorization = `Bearer ${token}`;
      await api.get('/auth/validate')
      
      setAuthenticated(true);
      setLoading(false);
      return true;
    } catch (error) {
      console.log('Token expirado ou inválido', error);
      await logout(true); 
      return false;
    }
  }

  useEffect(() => {
    validateToken();
  }, []);

  useEffect(() => {
    const interceptor = api.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error.response?.status === 401) {
          console.log('Token expirado - fazendo logout automático');
          await logout(true);
        }
        return Promise.reject(error);
      }
    );

    return () => {
      api.interceptors.response.eject(interceptor);
    };
  }, []);

  async function register(user) {
    let msgText = '';
    let msgType = '';

    try {
      const data = await ServiceAUTH.register(user).then((response) => {
        msgText = response.data.message;
        msgType = 'success';
        return response.data;
      });

      await authUser(data.data);
    } catch (error) {
      msgText = error.response.data.errors[0];
      msgType = 'error';
    }

    setFlashMessage(msgText, msgType);
  }

  async function forgotPassword(user) {
    let msgText = '';
    let msgType = '';

    try {
      await ServiceAUTH.forgotPassword(user).then((response) => {
        msgText = response.data.message;
        msgType = 'success';
        return response.data;
      });

      history.push('/login');
    } catch (error) {
      msgText = error.response.data.errors[0];
      msgType = 'error';
    }

    setFlashMessage(msgText, msgType);
  }

  async function login(user) {
    let msgText = '';
    let msgType = '';
    try {
      const data = await ServiceAUTH.login(user).then((response) => {
        msgText = response.data.message;
        msgType = 'success';

        return response.data;
      });

       await authUser(data.data);
    } catch (error) {
      msgText = error?.response?.data?.errors[0];
      msgType = 'error';
    }

    setFlashMessage(msgText, msgType);
  }

  async function authUser(data) {
    setAuthenticated(true);
    console.log('authenticated auth', authenticated);
    api.defaults.headers.Authorization = `Bearer ${data.token}`;
    memorizeFiltersUsers({
      ...getMemorizedFiltersUsers(),
      login: data?.user?.login,
      email: data?.user?.email,
      id: data?.user?.id
    });
    memorizeFiltersSystem({
      ...getMemorizedFiltersSystem(),
      theme: getMemorizedFiltersSystem()?.theme || 'light',
      emphasisColor:
        getMemorizedFiltersSystem()?.emphasisColor || 'rgb(20, 18, 129)'
    });
    localStorage.setItem('token', data.token);
    history.push('/inicio');
  }

  function logout(silent = false) {
    setAuthenticated(false);
    clearMemorizedFiltersUsers();
    localStorage.removeItem('token');
    api.defaults.headers.Authorization = undefined;
    
    if (!silent) {
      const msgText = 'Logout realizado com sucesso!';
      const msgType = 'success';
      setFlashMessage(msgText, msgType);
    } else {
      const msgText = 'Sua sessão expirou. Faça login novamente.';
      const msgType = 'warning';
      setFlashMessage(msgText, msgType);
    }
    
    history.push('/login');
  }

  return { authenticated, loading, register, login, logout, forgotPassword };
}