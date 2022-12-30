import {
  Box, Divider, Modal, Text, VStack,
  Image,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  SimpleGrid,
} from '@chakra-ui/react';
import React, { useCallback, useEffect, useState } from 'react';
import { Add, ArrowBack, BookmarkOutline, Camera, Trash, TrashOutline } from 'react-ionicons';
import Header from '../../components/Header';
import { Container } from '../../stylesGlobal/app';
import { db } from '../../util/Firebase';
import Dropdown from 'react-bootstrap/Dropdown';
import { useNavigate } from 'react-router-dom';
import './styleHome.css'
import { arrayUnion, collection, doc, onSnapshot, query, where } from 'firebase/firestore';
import { useContext } from 'react';
import { UserContext } from '../../context/UserContext';
import ImageViewer from 'react-simple-image-viewer';

const container = {
  width: '100%',
  height: '50%',
  alignSelf: 'center',
  alignItems: 'center',
  display: 'flex',
  flexDirection: 'column',
};
const ContainerHeaderContent = {
  display: 'flex',
  height: '100%',
  width: '100%',
  alignItems: 'center',
  alignSelf: 'center',
  justifyContent: 'center',
};
const containerContent = {
  alignItems: 'center',
  alignSelf: 'center',
  width: 400,
  height: 250,
  padding: 10,
  marginTop: -80
};
const HeaderContent = {
  display: 'flex',
  alignItems: 'center',
  position: 'absolute',
  top: 20
};
const botoes = {
  display: 'flex',
  marginBottom: 15,
  paddingLeft: '85%'
}

export const Home = () => {

  const navigation = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [filtro, setFiltro] = useState('Listas');
  const [minhasListas, setDataMinhasListas] = useState([]);
  const [imagensGaleria, setImagensGaleria] = useState([]);
  const { usuario, dadosAtualizadosDoPerfil, setDadosAtualizadosDoPerfil } = useContext(UserContext);
  const [Visualizador, setVisualizador] = useState(false);
  const [currentImage, setCurrentImage] = useState(0);
  const [listDeImg, setListDeImg] = useState([]);
  const [listaEmptyAndFull, setListaEmptyAndFull] = useState([]);
  const [openModalSelectLista, setOpenModalSelectLista] = useState(false);


  useEffect(() => {
    requestAllColecoes();
    requestDadosPerfil();
    recuperaAsImagensDaGaleria();
    requestAllColecoesAteEmpty();
  }, []);

  const recuperaAsImagensDaGaleria = async () => {
    const q = query(collection(db, "galeria"), where('idLojaOrigem', '==', usuario.uid));
    await onSnapshot(q, (querySnapshot) => {
      const listaDeImagens = [];
      querySnapshot.forEach((doc) => {
        listaDeImagens.push(doc.data());
      });
      setImagensGaleria(listaDeImagens);
    })
  };

  const requestAllColecoes = () => {
    db.collection('colecoes')
      .where('idUser', '==', usuario.uid)
      .where('visivel', '==', true)
      .orderBy("DataCriacaoColecao", "desc")
      .onSnapshot((querySnapshot) => {
        let MinhasListas = [];
        querySnapshot.forEach((doc) => {
          MinhasListas.push({ ...doc.data(), id: doc.id });
          setDataMinhasListas(MinhasListas);
        });
      });
  };

  const requestAllColecoesAteEmpty = () => {
    db.collection('colecoes')
      .where('idUser', '==', usuario.uid)
      .orderBy("DataCriacaoColecao", "desc")
      .onSnapshot((querySnapshot) => {
        let MinhasListas = [];
        querySnapshot.forEach((doc) => {
          MinhasListas.push({ ...doc.data(), id: doc.id });
          setListaEmptyAndFull(MinhasListas);
        });
      });
  };

  const requestDadosPerfil = async () => {
    var refDataUser = db.collection('usuarios').doc(usuario.uid);
    refDataUser.get().then((doc) => {
      if (doc.exists) {
        setDadosAtualizadosDoPerfil(doc.data());
      } else {
      }
    }).catch((error) => {
    });
  };

  const mudaFiltro = (txt) => {
    setFiltro(txt)
  };

  const openImageViewer = (imgSelected) => {
    setVisualizador(true)
    setListDeImg(imgSelected);
  };

  const closeImg = () => {
    setVisualizador(false);
  };

  const salvaImagemInColecao = (colecao, img) => {
    const ref_colecao = db.collection("colecoes").doc(colecao?.idColecao);
    var listImg = [];
    var listName = [];
    listImg.push(...img);
    listName.push(...img?.LojaOrigem)

    return ref_colecao.update({
      FotosLista: arrayUnion(listImg),
      visivel: true,
      Lojas: arrayUnion(listName)
    }).then(() => {
      setOpenModalSelectLista(false)
    }).catch((error) => {
    });

  };

  const goHome = () => navigation('/Home');
  const goAddFotos = () => navigation('/addImage');
  const goCreateList = () => navigation('/createList', { goBack: goHome });

  return (
    <>
      <Header
        dadosPerfil={dadosAtualizadosDoPerfil}
      />
      <div className='BG'>
        <div style={container}>
          {Visualizador ?
            null :
            <button onClick={() => onOpen()} className='botaoFloat'>
              <Text color={'white'} fontSize={40} mt={-2.5}>+</Text>
            </button>}
          <ModalOptions
            isOpen={isOpen}
            onOpen={onOpen}
            onClose={onClose}
            goAddFotos={goAddFotos}
            goCreateList={goCreateList}
          />
          <ModalListaParaSalvar
            salvaImagemInColecao={salvaImagemInColecao}
            Imagem={listDeImg}
            isOpen={openModalSelectLista}
            onOpen={onOpen}
            onClose={onClose}
            listaEmptyAndFull={listaEmptyAndFull}
            fechaModal={setOpenModalSelectLista}
          />
          <div style={ContainerHeaderContent}>
            <div style={containerContent}>
              {Visualizador ?
                <div>
                  <div style={HeaderContent}>
                    <ArrowBack
                      onClick={() => closeImg()}
                      style={{ height: 20, width: 20, color: 'white', marginLeft: 10 }} />
                    <img src={dadosAtualizadosDoPerfil?.user_foto_avatar} style={{ height: 55, width: 55, borderRadius: 10, marginLeft: 10 }} />
                    <div style={{
                      display: 'grid',
                      marginLeft: 20
                    }}>
                      <text style={{ color: 'white', fontSize: 13, marginBottom: 5 }}>{listDeImg.title}</text>
                      <div style={{ height: .5, width: 200, backgroundColor: 'white' }} />
                      <text style={{ color: 'white', fontSize: 13, marginTop: 5 }}>Meu perfil</text>
                    </div>
                  </div>
                  <div style={botoes}>
                    <BookmarkOutline onClick={() => setOpenModalSelectLista(true)} style={{ marginRight: 10 }} color={'white'} />
                    <TrashOutline color={'white'} />
                  </div>
                  <Image
                    objectFit={'cover'}
                    src={listDeImg.uri}
                    style={{ height: 400, width: 378 }}
                  />
                  <div style={{ justifyContent: 'center', display: 'flex', width: 390, marginTop: 10, marginBottom: 10 }}>
                    <text style={{ fontSize: 12, color: 'white', textAlign: 'center' }}>
                      {listDeImg.descricaoFoto}
                    </text>
                  </div>
                  <div style={{ height: .5, width: 380, backgroundColor: 'white' }} />

                </div>
                :
                <>
                  <Box w={['full', 'xl']} display={'flex'} style={{ marginBottom: 10, alignItems: 'center' }}>
                    <Text
                      className='txt'
                      onClick={() => mudaFiltro('Listas')}
                      color={filtro === 'Listas' ? 'white' : 'gray'}
                      fontWeight={'bold'}
                      fontSize={'xl'}>Listas</Text>
                    <div style={{ width: 2, height: 20, borderRadius: 5, backgroundColor: 'white', marginLeft: 10, marginRight: -10 }} />
                    <Text
                      className='txt'
                      onClick={() => mudaFiltro('Galeria')}
                      ml={18}
                      color={filtro === 'Galeria' ? 'white' : 'gray'}
                      fontWeight={'bold'} fontSize={'xl'}>Galeria</Text>
                  </Box>
                  {filtro === 'Listas' ?
                    <>
                      <Divider mt={1} w={'100%'} />
                      {minhasListas.length === 0 ?
                        <div style={{ width: '100%', height: '100%', paddingTop: 20 }}>
                          <Text style={{ color: 'white' }}>Não há listas aqui</Text>
                        </div>
                        :
                        <>
                          {minhasListas?.map((item) => (
                            <ul >
                              <Box
                                onClick={() => console.log(item.TitleLista)}
                                className='card'
                                mt={2} w={'100%'}
                                display={'flex'}>
                                <Box>
                                  <img style={{ height: 80, width: 80, borderRadius: 10 }} src={item.AvatarPerfil} />
                                </Box>
                                <Box>
                                  <Text fontSize={13} mt={1} ml={'2'} color={'white'}>{item.TitleLista}</Text>
                                  <Text fontSize={10} mt={1} ml={'2'} color={'white'}>Criada em {item.DataCriacaoColecao}</Text>
                                  <Text
                                    fontSize={10}
                                    mt={1}
                                    ml={'2'}
                                    color={'white'}>{item.TipoLista} . {item.Views} view . {item.shares} partilhas . {item.FotosLista.length} imagens</Text>
                                </Box>
                              </Box>
                            </ul>
                          ))}
                        </>
                      }
                    </>
                    :
                    <>
                      <div style={{ marginLeft: -10, marginRight: 5, paddingTop: 10 }}>
                        <SimpleGrid style={{ alignSelf: 'center', margin: 10 }} spacing={5} columns={3}>
                          {imagensGaleria.map((item, index) => {
                            return (
                              <button>
                                <Box width={'111px'} height={'160px'} >
                                  <Image
                                    onClick={() => openImageViewer(item)}
                                    objectFit={'cover'}
                                    src={item.uri}
                                    style={{ height: '100%', width: '100%', borderRadius: 10 }} />
                                </Box>
                              </button>
                            )
                          })}
                        </SimpleGrid>
                      </div>
                    </>
                  }
                </>}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

const ModalOptions = ({ isOpen, onOpen, onClose, goAddFotos, goCreateList }) => {

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent w={'90%'}>
        <ModalCloseButton color={'white'} />
        <ModalBody backgroundColor={'black'}>
          <Text className='txt' onClick={() => { }} fontSize={'20'} color={'white'} mt={'5'} mb={'15'}>História</Text>
          <Text className='txt' onClick={() => goAddFotos()} fontSize={'20'} color={'white'} mb={'15'}>Foto</Text>
          <Text className='txt' onClick={() => goCreateList()} fontSize={'20'} color={'white'} mb={'15'}>Listas</Text>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
};


const ModalListaParaSalvar = ({ isOpen, onOpen, onClose, listaEmptyAndFull, Imagem, salvaImagemInColecao, setOpenModalSelectLista }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent w={'90%'}>
        <ModalCloseButton onClick={() => setOpenModalSelectLista(false)} color={'white'} />
        <ModalBody backgroundColor={'black'}>
          <div >
            <SimpleGrid padding={'5'} spacing={5} columns={2}>
              {listaEmptyAndFull?.map((item) => {
                return (
                  <button onClick={() => salvaImagemInColecao(Imagem, item)}>
                    <Box height={'150px'}  >
                      <Image
                        objectFit={'cover'}
                        src={item.AvatarPerfil}
                        style={{ height: '120px', width: '100%', borderRadius: 10 }} />
                      <Text
                        style={{ textAlign: 'left', marginLeft: 5, fontSize: 13, marginTop: 5 }}
                        fontSize={'10px'}
                        color={'white'}>{item.TitleLista}</Text>
                    </Box>
                  </button>
                )
              })}
            </SimpleGrid>
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
};