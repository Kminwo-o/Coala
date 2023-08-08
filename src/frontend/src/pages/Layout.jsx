import React from 'react'
import { Outlet } from 'react-router-dom'
import { styled } from 'styled-components'
import Header from '../components/Common/Header'
import ChatOpenContainer from '../components/Chat/containers/ChatOpenContainer'
import ContractContainer from '../components/Contract/containers/ContractContainer'

const Layout = () => {
  return (
    <SLayout>
        <Header/>
        <Outlet/>
        <ChatOpenContainer/>
        <ContractContainer/>
    </SLayout>
  )
}

const SLayout = styled.div`
    display: flex;
    align-items:center;
    justify-content: center;
    flex-direction: column;
    width: 100%;
    margin: 0 auto;
`

export default Layout