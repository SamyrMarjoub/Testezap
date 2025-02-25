import { createGlobalState } from 'react-hooks-global-state';
const { setGlobalState, useGlobalState } = createGlobalState({
    userData:[],
    isOpenModalConfig:false
})
export { setGlobalState, useGlobalState }