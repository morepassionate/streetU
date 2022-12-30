import { useContext } from 'react';
import './App.css';
import { ChakraProvider } from '@chakra-ui/react'
import UserProvider, { UserContext } from './context/UserContext';
import Rotas from './rotas'; 

function App() {

  return (
    <ChakraProvider >
      <UserProvider> 
          <Rotas /> 
      </UserProvider>
    </ChakraProvider>
  );
}

export default App;
