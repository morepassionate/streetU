import React, { useContext, useState } from 'react';
import { Alert } from 'react-native';
import { StackActions, useNavigation } from '@react-navigation/native';
import { UserContext } from '../contexts/UserContext';

export const useLogin = () => {

  const navigation = useNavigation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [lembrarSenha, setLembrarSenha] = useState(false);
  const re = /\S+@\S+\.\S+/;
  const { entrarLogin } = useContext(UserContext);
  const nextErrors = {};

  const validateEmail = (txt) => {
    if (!txt) return nextErrors.email = "Obrigatório informar o email !";
    if (!re.test(txt)) return nextErrors.email = "Insira um e-mail válido !";
  }

  const validateSenha = (txt) => {
    if (!txt) return nextErrors.password = "Obrigatório informar a senha !";
    if (txt.length < 5) return nextErrors.password = "Senha precisa de no mínimo de 6 caracteres !";

  }

  const submit = async () => {
    validateEmail(email);
    validateSenha(password);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return null;

    return entrarLogin(email, password);
  };

  return {
    lembrarSenha,
    setLembrarSenha,
    submit,
    errors,
    email,
    setEmail,
    password,
    setPassword,
  };
};
