import React, { useState, useContext } from 'react';
import { Alert, View } from 'react-native';
import { UserContext } from '../contexts/UserContext';
import { novoUser } from '../objetos/Users';
import * as ImagePicker from 'expo-image-picker';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { arrayUnion, collection, doc, setDoc } from 'firebase/firestore';

export const useCadastro = () => {

    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [celular, setCelular] = useState('');
    const [password, setPassword] = useState('');
    const [confirmationPassword, setConfirmationPassword] = useState('');
    const [imageSelected, setImageSelected] = useState(null);
    const [aceitaTermos, setAceitaTermos] = useState(false);
    const [errors, setErrors] = useState({});
    const { criarConta } = useContext(UserContext);
    const re = /\S+@\S+\.\S+/;

    var tipo = 0;
    var endereco = "ainda nao informado";
    var user_foto_avatar = "ainda nao informado"

    const nextErrors = {};


    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.cancelled) {
            setImageSelected(result.uri);
        }
    };

    const validateEmail = (txt) => {
        if (!txt) return nextErrors.email = "Obrigatório informar o email !";
        if (!re.test(txt)) return nextErrors.email = "Insira um e-mail válido !";
    }

    const validateSenha = (txt) => {
        if (!txt) return nextErrors.password = "Obrigatório informar a senha !";
        if (txt.length < 5) return nextErrors.password = "Senha precisa de no mínimo de 6 caracteres !";
    }

    const validateConfirmationSenha = (txt) => {
        if (!txt) return nextErrors.confirmationPassword = "Obrigatório informar a mesma senha !";
        if (txt.length < 5) return nextErrors.confirmationPassword = "Senha precisa de no mínimo de 6 caracteres !";
        if (txt !== password) return nextErrors.confirmationPassword = "As senhas não coincidem!";
    }

    const validateNome = (txt) => {
        if (!txt) return nextErrors.nome = "Obrigatório informar o nome !";
        if (txt.length < 4) return nextErrors.nome = "Insira seu nome completo, por favor !";

    }

    const validateCelular = (txt) => {
        if (!txt) return nextErrors.celular = "Obrigatório informar o número !"; 
    }

    const submit = () => {
        if (aceitaTermos && !!imageSelected) {
            validateEmail(email);
            validateSenha(password);
            validateConfirmationSenha(confirmationPassword);
            validateNome(nome);
            validateCelular(celular);
            setErrors(nextErrors);

            if (Object.keys(nextErrors).length > 0) return null;

            const novoUsuario = novoUser(0, user_foto_avatar, nome, celular, email, password, endereco, tipo, true, 2, 2, 2);
            return criarConta(nome, email, password, novoUsuario, imageSelected);
        } else {
            if(!aceitaTermos) return Alert.alert('Atenção', 'Você precisa concordar com os termos de uso para criar sua conta !');
            if(!imageSelected) return Alert.alert('Atenção', 'Você precisa escolher uma imagem para o seu perfil !');
        }
    };

    return {
        submit,
        errors,
        nome,
        email,
        celular,
        password,
        confirmationPassword,
        setEmail,
        setPassword,
        setConfirmationPassword,
        setNome,
        setCelular,
        pickImage,
        imageSelected,
        aceitaTermos,
        setAceitaTermos
    }
}