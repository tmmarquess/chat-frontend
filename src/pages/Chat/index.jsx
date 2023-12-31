import React from "react"
import { Header } from "../../components/Header"
import { SearchPeople, 
        Sidebar, 
        Container, 
        ChatScreen, 
        ContentCont, 
        Title, 
        ButtonGroup, 
        ContainerBar, 
        ContactContainer ,
        ChatTitle,
    } from "./style"

export function Chat(){
   
    return(
        <>
        <Container>
            <SearchPeople>
                <Header/>
            </SearchPeople>
            <ContentCont>
                <Sidebar>
                    <ContainerBar>
                        <Title>My chats</Title>
                        <ButtonGroup>New Group Chat +</ButtonGroup> 
                    </ContainerBar>  
                    <ContactContainer>

                    </ContactContainer>
                </Sidebar>
                <ChatScreen>
                    <ChatTitle>Click on a user to start chatting</ChatTitle>
                </ChatScreen>
            </ContentCont>
        </Container>
        </>
    )
}