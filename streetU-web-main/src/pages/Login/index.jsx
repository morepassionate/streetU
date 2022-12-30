import React, { useState, useCallback, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Botao from '../../components/Botao';
import Logo from '../../components/Logo/Logo';
import { Container } from '../../stylesGlobal/app';
import './styles.css';
import { Box, VStack, Heading, Text, } from '@chakra-ui/layout';
import {
    FormControl,
    FormLabel,
    FormErrorMessage,
    FormHelperText,
    Input,
    IconButton,
    Checkbox
} from '@chakra-ui/react';
import { PretoInput, VermelhoPadrao } from '../../variables/colors';
import { UserContext } from '../../context/UserContext';

export default function Login() {

    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [lembraSenha, setLembraSenha] = useState(false);
    const { entrarLogin, listenerLogar } = useContext(UserContext);
    const navigate = useNavigate();

    const submitCadastro = () => navigate('/Cadastro');

    const handleChange = () => {
        setLembraSenha(!lembraSenha);
    };

    const submitLogin = () => {
        entrarLogin(email, senha)
    };

    return (
        <Container>
            <Box
                w={['full', 'md']}
                p={[8, 10]}
                mt={[0, '5vh']}
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
                        <Logo />
                        <Heading
                            size={'lg'}
                            alignSelf={'center'}
                            color={'white'}>Login da loja</Heading>
                    </VStack>
                    <FormControl>
                        <Input
                            variant="filled"
                            backgroundColor={PretoInput}
                            placeholder='Email'
                            color={'white'}
                            type='email'
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                        />
                        <Input
                            variant="filled"
                            backgroundColor={PretoInput}
                            placeholder='Senha'
                            color={'white'}
                            type='password'
                            mt={5}
                            value={senha}
                            onChange={e => setSenha(e.target.value)}
                        />
                    </FormControl>
                    <Checkbox alignSelf={'center'} color={'white'} colorScheme={'red'} defaultChecked>Lembrar senha</Checkbox>
                    <a onClick={() => { }} className='outlineText'>Esqueci minha senha</a>
                    
                    <Botao handlerSubmit={submitLogin} titleButton={'Login'} />
                    <Botao type={'outline'} handlerSubmit={submitCadastro} titleButton="Criar conta" />
                </VStack>
            </Box>
        </Container>
    );
} 