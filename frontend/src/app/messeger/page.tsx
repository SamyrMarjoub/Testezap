"use client"

import { Box, Button, Icon, Input, Text } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import colors from "../styles/colors";
import Sidebar from "../components/messenger/sidebar/sidebar";
import Maincomponent from "../components/messenger/sidebar/maincomponent";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useGlobalState, setGlobalState } from "@/globalstate/globalstate";
import { IoMdClose } from "react-icons/io";
import { MdAdd } from "react-icons/md";
import Maincomponentnochat from "../components/messenger/sidebar/maincomponentnochat";
import Loading from '../components/geral/loading';
import { FiArrowRight } from "react-icons/fi";
import { handleSearch, handleAddFriend, handleAcceptRequest, handleRejectRequest, fetchFriendRequests } from "../components/firestore.ts/firestore";

const Dashboard = () => {
  const token = localStorage.getItem('token')
  const router = useRouter();
  const uid = localStorage.getItem('uid')
  const [userData, setUserData] = useGlobalState('userData')
  const [userSelectedData, setUserSelectedData] = useGlobalState('userSelectedData')
  const [isLoading, setIsLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 0);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth
      setWindowWidth(width)
      if (width >= 800) {
        setIsSidebarOpen(true)
      } else {
        setIsSidebarOpen(false)
      }
    }

    window.addEventListener('resize', handleResize)
    handleResize()
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    if (!token) {
      router.push("/login");
      return;
    } else {
      if (uid) {
        fetchUserData().then(() => {
          setIsLoading(false);
        });
      } else {
        setIsLoading(false);
      }
    }
  }, [token, router, uid]);


  useEffect(() => {
    if (uid) fetchUserData();
  }, [uid]);


  const fetchUserData = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/user/${uid}`);
      console.log("User Data:", response.data);
      const userdata = response.data;
      setGlobalState('userData', userdata);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

 

  function ModalConfig() {
    const [isOpenModalConfig, setGlobalState] = useGlobalState("isOpenModalConfig");

    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const handleClick = () => {
      if (fileInputRef.current) {
        fileInputRef.current.click();
      }
    };

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;

      const uid = localStorage.getItem('uid');
      if (!uid) {
        alert('Usuário não autenticado');
        return;
      }

      const formData = new FormData();
      formData.append('image', file);
      formData.append('uid', uid);
      // useEffect(() => {
      //   const loadRequests = async () => {
      //     const requests = await fetchFriendRequests();
      //     setFriendRequests(requests);
      //     console.log("request aqui", requests)
      //   };
  
      //   loadRequests();
      // }, []);
      try {
        const response = await axios.post('http://localhost:5000/api/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        if (response.status === 200) {
          // alert('Imagem de perfil atualizada!');
          setGlobalState(false);
          window.location.reload();

        } else {
          alert(`Erro: ${response.data.message}`);
        }
      } catch (error) {
        console.error('Erro ao enviar imagem:', error);
        alert('Erro ao enviar imagem');
      }
    };


    if (!isOpenModalConfig) return null; // Se o modal não estiver aberto, retorna nada

    return (
      <Box
        onClick={() => setGlobalState(false)} // Apenas um argumento
        width="100%"
        height="100vh"
        position="fixed"
        top="0"
        left="0"
        display="flex"
        justifyContent="center"
        alignItems="center"
        zIndex="1000"
        className="externalLinkComponentMain"
        bg="rgba(0, 0, 0, 0.8)"
      >

        <Box onClick={(e) => e.stopPropagation()} width={'400px'} display={'flex'} justifyContent={'center'} alignItems={'center'} height={'350px'} rounded={'20px'} bg={colors.default.bg_primary}>
          <Box width={'95%'} height={'95%'} pos={'relative'}>
            <IoMdClose size={'30px'} cursor={'pointer'} onClick={() => setGlobalState(false)} style={{ top: '0px', right: '0px', position: 'absolute' }} />
            <Box w={'100%'} height={'100%'} display={'flex'} flexDirection={'column'}>
              <Text fontSize={'20px'}>Configuração</Text>

              <Box
                width={'100%'}
                flexDir={'column'}
                alignItems={'center'}
                display={'flex'}
                justifyContent={'center'}
                mt={'50px'}
              >
                <Text mb={'10px'} fontSize={'18px'} color={'gray.300'}>
                  Adicionar imagem de perfil
                </Text>

                <Box
                  cursor={'pointer'}
                  width={'80px'}
                  display={'flex'}
                  alignItems={'center'}
                  justifyContent={'center'}
                  height={'80px'}
                  border={`1px solid ${colors.default.blue}`}
                  rounded={'full'}
                  onClick={handleClick}

                  bg={colors.default.bg_secondary}
                >
                  <MdAdd size={'35px'} />
                  <input
                    type="file"
                    ref={fileInputRef}
                    style={{ display: 'none' }}
                    accept="image/*"
                    onChange={handleFileChange}
                  />

                </Box>
              </Box>

              {/* Fazendo a última div ocupar o espaço restante */}
              <Box flex={1} display={'flex'} alignItems={'flex-end'} gap={'10px'} justifyContent={'flex-end'}>
                <Button onClick={() => setGlobalState(false)} bg={'transparent'} fontSize={'16px'} border={`1px solid ${colors.default.blue}`} color={'white'} borderRadius={'10px'} width={'150px'}>Close</Button>
                {/* <Button bg={colors.default.blue} fontSize={'16px'} color={'white'} width={'120px'}>Salvar</Button> */}

              </Box>
            </Box>

          </Box>
        </Box>

      </Box>
    );
  }
  function ModalFriend() {
    const [isOpenModalFriend, setGlobalState] = useGlobalState("isOpenModalFriend");

    const [search, setSearch] = useState('');
    const [userFound, setUserFound] = useState(null);
    const [loading, setLoading] = useState(false);
    const [friendRequests, setFriendRequests] = useState([]);

    useEffect(() => {
      const unsubscribe = fetchFriendRequests(setFriendRequests);
  
      return () => unsubscribe && unsubscribe(); // Cleanup da escuta
    }, []);

    if (!isOpenModalFriend) return null; // Se o modal não estiver aberto, retorna nada

    function closeModal() {
      setGlobalState(false)
    }


    return (
      <Box
        onClick={() => setGlobalState(false)} // Apenas um argumento
        width="100%"
        height="100vh"
        position="fixed"
        top="0"
        left="0"
        display="flex"
        justifyContent="center"
        alignItems="center"
        zIndex="1000"
        className="externalLinkComponentMain"
        bg="rgba(0, 0, 0, 0.8)"
      >

        <Box onClick={(e) => e.stopPropagation()} width={'400px'} display={'flex'} justifyContent={'center'} alignItems={'center'} height={'auto'} rounded={'20px'} bg={colors.default.bg_primary}>
          <Box width={'95%'} height={'95%'} >
            <Box pos="fixed" top={0} left={0} width="100vw" height="100vh" bg="rgba(0, 0, 0, 0.6)" display="flex" justifyContent="center" alignItems="center" zIndex={1000}>
              <Box bg="gray.800" color="white" borderRadius="12px" p={6} width="400px" display="flex" flexDirection="column" boxShadow="lg">
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
                  <Text fontSize="xl">Adicionar Amigos</Text>
                  <IoMdClose size={24} cursor="pointer" onClick={closeModal} />
                </Box>
                <Box display="flex" gap={3} alignItems="center">
                  <Input
                    placeholder="Digite o username"
                    value={search}
                    bg="gray.700"
                    padding={3}
                    onChange={(e) => setSearch(e.target.value)}
                    flex={1}
                  />
                  <Button onClick={() => handleSearch(search, uid, setUserFound, setLoading)} disabled={loading}>
                    {loading ? "Buscando..." : "Buscar"}
                  </Button>
                </Box>
                {userFound && (
                  <Box mt={4} p={3} bg="gray.700" borderRadius="8px" display="flex" alignItems="center" gap={3}>
                    <img src={userFound.profilePicture} width={'50px'} height={'50px'} />
                    <Text flex={1}>{userFound.username}</Text>
                    <Button color={'white'} bg={colors.default.blue} onClick={() => handleAddFriend(uid, userData, userFound)}>Adicionar</Button>
                  </Box>
                )}
                <Box mt={6}>
                  <Text fontSize="lg" mb={3}>Pedidos de amizade pendentes</Text>
                  {friendRequests?.length > 0 ? (
                    friendRequests.map(request => (
                      <Box key={request.id} p={3} bg="gray.700" borderRadius="8px" display="flex" alignItems="center" gap={3} mt={2}>
                        {request.user1Avatar ?
                          <img src={request.user1Avatar} width={'50px'} height={'50px'} />
                          : <Box width={'50px'} height={'50px'} bg={colors.default.blue} rounded={'full'}>

                          </Box>
                        }
                        <Text color={'white'} flex={1}>
                          {request.user1Name || "Usuario"}
                        </Text>
                        <Button onClick={() => handleAcceptRequest(request.id, setFriendRequests, friendRequests)}>Aceitar</Button>
                        <Button onClick={() => handleRejectRequest(request.id, setFriendRequests, friendRequests)}>Rejeitar</Button>
                      </Box>
                    ))
                  ) : (
                    <Text fontSize="sm" color="gray.400">Nenhum pedido pendente.</Text>
                  )}
                </Box>

              </Box>
            </Box>

          </Box>
        </Box>

      </Box>
    )
  }

  if (isLoading) {
    return <Loading />;
  }

  return (
    <Box width={'100%'} display={'flex'} justifyContent={'center'} height={'100vh'} bg={colors.default.bg_primary}>
      <Box display={'flex'} className="messegerPageMainContainer" width={'1500px'} bg={colors.default.bg_secondary} height={'100%'}>
        {isSidebarOpen && (
          <Sidebar
            onClose={() => setIsSidebarOpen(false)}
            windowWidth={windowWidth}
          />
        )}

        {Object.keys(userSelectedData || {}).length > 0 ? <Maincomponent /> : <Maincomponentnochat />}

        {windowWidth < 800 && !isSidebarOpen && (
          <Box
            position="fixed"
            left="0"
            top="50%"
            transform="translateY(-50%)"
            zIndex="999"
            onClick={() => setIsSidebarOpen(true)}
            cursor="pointer"
            p={2}
            bg={colors.default.bg_primary}
            borderRadius="0 10px 10px 0"
          >
            <Icon as={FiArrowRight} color="white" boxSize={6} />
          </Box>
        )}

        <ModalConfig />
        <ModalFriend />
      </Box>
    </Box>
  );
};

export default Dashboard;
