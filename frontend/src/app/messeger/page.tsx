"use client"

import { Box, Button, Text } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import colors from "../styles/colors";
import Sidebar from "../components/messenger/sidebar/sidebar";
import Maincomponent from "../components/messenger/sidebar/maincomponent";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useGlobalState, setGlobalState } from "@/globalstate/globalstate";
import gato from '../../../public/gato.jpg'
import { IoMdClose } from "react-icons/io";
import Image from "next/image";
import { MdAdd } from "react-icons/md";


const Dashboard = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const token = localStorage.getItem('token')
  const router = useRouter();
  const uid = localStorage.getItem('uid')
  const [avatar, setAvatar] = useState('')


  if (!token) router.push("/login")

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
      formData.append('file', file);
      formData.append('uid', uid);

      try {
        const response = await fetch('/api/upload-profile', {
          method: 'POST',
          body: formData,
        });

        const data = await response.json();
        if (response.ok) {
          alert('Imagem de perfil atualizada!');
        } else {
          alert(`Erro: ${data.message}`);
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
                <Button onClick={() => setGlobalState(false)} bg={'transparent'} fontSize={'16px'} border={`1px solid ${colors.default.blue}`} color={'white'} borderRadius={'10px'} width={'100px'}>Close</Button>
                <Button bg={colors.default.blue} fontSize={'16px'} color={'white'} width={'120px'}>Salvar</Button>

              </Box>
            </Box>

          </Box>
        </Box>

      </Box>
    );
  }


  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/user/${uid}`);
        console.log("User Data:", response.data);
        const userdata = response.data
        setGlobalState('userData', userdata)
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    if (uid) fetchUserData();
  }, [token, uid, router]);

  return (
    <Box width={'100%'} display={'flex'} justifyContent={'center'} height={'100vh'} bg={colors.default.bg_primary}>
      <Box display={'flex'} width={'1500px'} bg={colors.default.bg_secondary} height={'100%'}>
        <Sidebar />
        <Maincomponent />
        <ModalConfig />
      </Box>
    </Box>
  );
};

export default Dashboard;
