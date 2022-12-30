import React, { useContext, useEffect, useRef, useState } from 'react';
import Logo from '../../components/Logo/Logo';
import { Container } from '../../stylesGlobal/app';
import { Box, VStack, Heading, Text, } from '@chakra-ui/layout';
import './style.css';
import {
    FormControl,
    FormLabel,
    FormErrorMessage,
    FormHelperText,
    Input,
    Checkbox,
    IconButton,
    Button
} from '@chakra-ui/react'
import { PretoInput, VermelhoPadrao } from '../../variables/colors';
import Botao from '../../components/Botao';
import BotaoSelectedAvatar from '../../components/BotaoSelectedAvatar';
import { CameraOutline } from 'react-ionicons';
import { novaLojaUser } from '../../objeto/LojaUser';
import { UserContext } from '../../context/UserContext';

export default function Cadastro() {

    const [nome, setNome] = useState(null);
    const [email, setEmail] = useState(null);
    const [senha, setSenha] = useState(null);
    const [celular, setCelular] = useState(null);
    const [confirmSenha, setConfirmSenha] = useState(null);
    const [imgProfile, setImgProfile] = useState(null);
    const hiddenFileInput = useRef(null);
    const { criarConta, loading, listenerCadastro } = useContext(UserContext); 

    const funcCriaConta = () => {
        const novaLojaAtributos = novaLojaUser(null, imgProfile, nome, celular, email, senha, null, 1, true, 2, 2, 2);
        criarConta(nome, email, senha, novaLojaAtributos, imgProfile);
    }

    const submitCadastro = () => {
        if (email && nome && senha && celular && confirmSenha && imgProfile !== null) return funcCriaConta();
    };

    const percebeClick = () => {
        hiddenFileInput.current.click()
    };

    const handlerChooseImage = (event) => {
        var file = event.target.files[0];
        const reader = new FileReader();
        reader.onload = () => {
            if (reader.readyState === 2) {
                setImgProfile(reader.result)
                console.log(reader.result)
            }
        }
        reader.readAsDataURL(file);
    };

    return (
        <Container>
            <Box
                w={['full', 'md']}
                p={[8, 10]}
                mt={1}
                mx='auto'
                alignItems={'center'}
            >
                <VStack
                    spacing={4}
                    align='flex-start'
                    w='full'>
                    <VStack
                        spacing={1}
                        align={['flex-start', 'center']}
                        w='full'>
                        <button
                            onClick={() => percebeClick()}
                            style={{ alignSelf: 'center', backgroundColor: ' #7d7d7d', height: 60, width: 60, borderRadius: 60, }}>
                            {imgProfile ?
                                <img src={imgProfile} style={{ height: 60, width: 60, borderRadius: 60, marginTop: -3 }} />
                                :
                                <CameraOutline color={'white'} style={{ marginLeft: 19 }} />
                            }
                        </button>
                        <input type="file" ref={hiddenFileInput} onChange={handlerChooseImage} style={{ display: 'none' }} />

                        <Heading
                            size={'lg'}
                            alignSelf={'center'}
                            color={'white'}>Crie sua conta</Heading>
                    </VStack>
                    <FormControl>
                        <Input
                            variant="filled"
                            backgroundColor={PretoInput}
                            placeholder='Nome'
                            color={'white'}
                            type='default'
                            value={nome}
                            onChange={e => setNome(e.target.value)}
                        />
                        {!nome && (
                            <a className='msg'>Voce precisa inserir o nome da loja !</a>
                        )}
                        <Input
                            variant="filled"
                            backgroundColor={PretoInput}
                            placeholder='Email'
                            color={'white'}
                            type='email'
                            mt={5}
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                        />
                        {!email && (
                            <a className='msg'>Voce precisa inserir um email válido !</a>
                        )}
                        <Input
                            variant="filled"
                            backgroundColor={PretoInput}
                            placeholder='Celular'
                            color={'white'}
                            type='number'
                            mt={5}
                            value={celular}
                            onChange={e => setCelular(e.target.value)}
                        />
                        {!celular && (
                            <a className='msg'>Voce precisa inserir um número válido !</a>
                        )}
                        <Input
                            variant="filled"
                            backgroundColor={PretoInput}
                            placeholder='Insira uma senha'
                            color={'white'}
                            type='password'
                            mt={5}
                            value={senha}
                            onChange={e => setSenha(e.target.value)}
                        />
                        {!senha && (
                            <a className='msg'>Voce precisa inserir uma senha válida !</a>
                        )}
                        <Input
                            variant="filled"
                            backgroundColor={PretoInput}
                            placeholder='Confirme sua senha'
                            color={'white'}
                            type='password'
                            mt={5}
                            value={confirmSenha}
                            onChange={e => setConfirmSenha(e.target.value)}
                        />
                        {confirmSenha !== senha && (
                            <a className='msg'>As senhas precisam corresponderem !</a>
                        )}
                    </FormControl>
                    <Checkbox alignSelf={'center'} color={'white'} colorScheme={'red'} defaultChecked>Concordo com os termos de uso</Checkbox>
                    {loading ?
                        <Button
                            isLoading
                            colorScheme='red'
                            w={'10%'}
                            borderRadius={20}
                            alignSelf={'center'}
                        /> :
                        <Botao handlerSubmit={submitCadastro} titleButton="Confirmar" />
                    }
                </VStack>
            </Box>
        </Container>
    );
}
