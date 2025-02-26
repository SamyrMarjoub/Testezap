"use client"

import { Box, Button, Input, Text } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import colors from "../styles/colors";
import Sidebar from "../components/messenger/sidebar/sidebar";
import Maincomponent from "../components/messenger/sidebar/maincomponent";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useGlobalState, setGlobalState } from "@/globalstate/globalstate";
import { IoMdClose } from "react-icons/io";
import { MdAdd } from "react-icons/md";
import { collection, getDocs, query, setDoc, where, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { db, auth } from '../services/firebaseClient'; // Certifique-se de importar corretamente
import Maincomponentnochat from "../components/messenger/sidebar/maincomponentnochat";
import Loading from '../components/geral/loading';

const Dashboard = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const token = localStorage.getItem('token')
  const router = useRouter();
  const uid = localStorage.getItem('uid')
  const [friendRequests, setFriendRequests] = useState([]);
  const [avatar, setAvatar] = useState('')
  const [userData, setUserData] = useGlobalState('userData')
  const [userSelectedData, setUserSelectedData] = useGlobalState('userSelectedData')
  const [isLoading, setIsLoading] = useState(true);

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

  useEffect(() => {
    fetchFriendRequests();
  }, []);
  useEffect(() => {
    console.log(userSelectedData)
  }, [userSelectedData])

  const fetchFriendRequests = async () => {
    const userId = auth.currentUser?.uid;
    console.log("aqui1")

    if (!uid) return;

    const q = query(collection(db, 'friendships'), where('user2', '==', uid), where('status', '==', 'pending'));
    const querySnapshot = await getDocs(q);
    const requests = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    console.log("aqui2", requests)

    setFriendRequests(requests);

  };

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

    if (!isOpenModalFriend) return null; // Se o modal não estiver aberto, retorna nada

    function closeModal() {
      setGlobalState(false)
    }

    const handleSearch = async () => {
      if (!search) return;
      setLoading(true);

      const q = query(collection(db, 'users'), where('username', '==', search));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const userData = querySnapshot.docs[0].data();
        setUserFound(userData);

        // Verifica se já são amigos
        const friendId = userData.uid;
        const friendshipQuery = query(
          collection(db, 'friendships'),
          where('status', '==', 'accepted'),
          where('user1', 'in', [uid, friendId]),
          where('user2', 'in', [uid, friendId])
        );

        const friendshipSnapshot = await getDocs(friendshipQuery);

        if (!friendshipSnapshot.empty) {
          alert('Este usuário já está na sua lista de amigos!');
          setUserFound(null);
        }
      } else {
        setUserFound(null);
      }

      setLoading(false);
    };


    const handleAddFriend = async () => {
      if (!uid) return;
      // const userId = auth.currentUser?.uid;
      const friendId = userFound.uid;

      if (!uid || !friendId) return;

      try {
        await setDoc(doc(db, 'friendships', `${uid}_${friendId}`), {
          user1: uid,
          user1Name: userData.username,
          user1Avatar: userData.profilePicture || "",
          user2: friendId,
          user2Name: userFound?.username,
          user2Avatar: userFound?.profilePicture,
          status: 'pending',
        });
        alert('Pedido de amizade enviado!');
      } catch (error) {
        console.error('Erro ao adicionar amigo:', error);
      }
    };

    const handleAcceptRequest = async (requestId) => {
      try {
        await updateDoc(doc(db, 'friendships', requestId), { status: 'accepted' });
        setFriendRequests(friendRequests.filter(req => req.id !== requestId));
        alert('Pedido de amizade aceito!');
      } catch (error) {
        console.error('Erro ao aceitar pedido de amizade:', error);
      }
    };

    const handleRejectRequest = async (requestId) => {
      try {
        await deleteDoc(doc(db, 'friendships', requestId));
        setFriendRequests(friendRequests.filter(req => req.id !== requestId));
        alert('Pedido de amizade rejeitado!');
      } catch (error) {
        console.error('Erro ao rejeitar pedido de amizade:', error);
      }
    };


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
                  <Button bg={colors.default.blue} color="white" onClick={handleSearch} isLoading={loading} _hover={{ bg: "blue.600" }}>
                    Buscar
                  </Button>
                </Box>
                {userFound && (
                  <Box mt={4} p={3} bg="gray.700" borderRadius="8px" display="flex" alignItems="center" gap={3}>
                    <img src={userFound.profilePicture} width={'50px'} height={'50px'} />
                    <Text flex={1}>{userFound.username}</Text>
                    <Button color={'white'} bg={colors.default.blue} onClick={handleAddFriend}>Adicionar</Button>
                  </Box>
                )}
                <Box mt={6}>
                  <Text fontSize="lg" mb={3}>Pedidos de amizade pendentes</Text>
                  {friendRequests.length > 0 ? (
                    friendRequests.map(request => (
                      <Box key={request.id} p={3} bg="gray.700" borderRadius="8px" display="flex" alignItems="center" gap={3} mt={2}>
                        {request.user1Avatar ?
                          <img src={request.user1Avatar} width={'50px'} height={'50px'} />
                          : <Box width={'50px'} height={'50px'} bg={colors.default.blue} rounded={'full'}>

                          </Box>
                        }
                        <Text color={'white'} flex={1}>
                          {request.user1Name || "Uusario"}
                        </Text>
                        <Button color={'white'} bg={'green.solid'} size="md" onClick={() => handleAcceptRequest(request.id)}>Aceitar</Button>
                        <Button bg={'red.solid'} color={'white'} colorScheme="red" size="md" onClick={() => handleRejectRequest(request.id)}>Rejeitar</Button>
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
      <Box display={'flex'} width={'1500px'} bg={colors.default.bg_secondary} height={'100%'}>
        <Sidebar />
        {Object.keys(userSelectedData || {}).length > 0 ? <Maincomponent /> : <Maincomponentnochat />}
        <ModalConfig />
        <ModalFriend />
      </Box>
    </Box>
  );
};

export default Dashboard;
