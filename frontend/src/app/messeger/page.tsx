"use client"

import { Box, Text } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import colors from "../styles/colors";
import Sidebar from "../components/messenger/sidebar/sidebar";
import Maincomponent from "../components/messenger/sidebar/maincomponent";

const Dashboard = () => {
  const tooken = localStorage.getItem('token')
  const router = useRouter();

  if (!tooken) router.push("/login");

  return (
    <Box width={'100%'} display={'flex'} justifyContent={'center'} height={'100vh'} bg={colors.default.bg_primary}>
      <Box display={'flex'} width={'1500px'} bg={colors.default.bg_secondary} height={'100%'}>
        <Sidebar />
        <Maincomponent/>
      </Box>
    </Box>
  );
};

export default Dashboard;
