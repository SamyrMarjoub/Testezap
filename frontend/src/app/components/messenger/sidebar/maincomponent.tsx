import colors from '@/app/styles/colors'
import { Box } from '@chakra-ui/react'
import React from 'react'

export default function maincomponent() {
  return (
    <Box width={'100%'} height={'100%'} display={'flex'}padding={'10px'}>
      <Box width={'100%'} height={'100%'} bg={colors.default.bg_primary}>

      </Box>
    </Box>
  )
}
