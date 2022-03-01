import React, { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { userType } from '../../../types/types';
import { login } from '../../../utils/API';
import { validateLogin } from '../../../utils/utils';
import './login.scss';

type ILogin = {
  setIsLoginForm: (newState: boolean) => void
}

export default function Login({ setIsLoginForm }: ILogin) {
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [isCorrectLogin, setIsCorrectLogin] = useState(true);
  const dispatch = useDispatch();
  const timeoutId:{current: NodeJS.Timeout | null} = useRef(null);
  const navigate = useNavigate();

  async function signIn() {
    navigate('/login');
    if (!validateLogin(email, password)) {
      setIsCorrectLogin(false);
      return;
    }
    await login(email, password)
    .then((data) => {
      navigate('/');
      localStorage.setItem('entryTime', new Date().toString());
      dispatch({ type: userType.UPDATE_USER, payload: data });
    })
    .catch((e) => setIsCorrectLogin(false));
  }

  function incorrectLogin() {
    timeoutId.current = setTimeout(() => setIsCorrectLogin(true), 3500);
    return <h4 className="login__error">Неверный логин или пароль</h4>;
  }

  useEffect(() => () => {
    if (timeoutId.current) {
      clearTimeout(timeoutId.current);
    }
  });

  return (
    <div className="login">
      {!isCorrectLogin && incorrectLogin()}
      <h2>Вход</h2>
      <input className="login__mail" onChange={(e) => setEmail(e.target.value)} type="email" placeholder="Email" required />
      <input className="login__password" onChange={(e) => setPassword(e.target.value)} type="password" placeholder="Password" required />
      <button className="login__sumbit" onClick={signIn} type="button">Войти</button>
      <p className="login__text">
        Еще не зарегистрированы?
        <button onClick={() => setIsLoginForm(false)} type="button">Создать аккаунт</button>
      </p>
    </div>
  );
}
