// ⚙️ React e bibliotecas externas
import { useState } from 'react';
import { useHistory } from 'react-router-dom';

// 🔐 Serviços / API
import api from '../services/api';
import ServiceAUTH from '../services/ServiceAUTH';

// 🧠 Hooks customizados
import useFlashMessage from './userFlashMessage';

export default function useAuth() {
  // TODO: Validar authUser
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const history = useHistory();
  const { setFlashMessage } = useFlashMessage();

  async function register(user) {
    let msgText = '';
    let msgType = '';

    try {
      const data = await ServiceAUTH.register(user).then((response) => {
        msgText = response.data.message;
        msgType = 'success';
        return response.data;
      });

      // await authUser(data)
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

      // await authUser(data)
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

      // await authUser(data)
    } catch (error) {
      msgText = error.response.data.errors[0];
      msgType = 'error';
    }

    setFlashMessage(msgText, msgType);
  }

  async function authUser(data) {
    setAuthenticated(true);
    localStorage.setItem('token', data.token);
    history.push('/');
  }

  function logout() {
    const msgText = 'Logout realizado com sucesso!';
    const msgType = 'success';

    setAuthenticated(false);
    localStorage.removeItem('token');
    api.defaults.headers.Authorization = undefined;
    history.push('/login');

    setFlashMessage(msgText, msgType);
  }

  return { authenticated, loading, register, login, logout, forgotPassword };
}
