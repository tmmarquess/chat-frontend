import React from "react"
import { AiOutlineSearch, AiFillBell, AiFillCaretDown } from "react-icons/ai";
import Thiago from '../../img/Thiago.png'
import { SearchPeople, 
        Sidebar, 
        Container, 
        ChatScreen, 
        ContentCont, 
        Decoration, 
        Title, 
        ButtonGroup, 
        ContainerBar, 
        ContactContainer ,
        ChatTitle,
        SearchContainer,
        TitleSearch,
        Notification,
        ProfileButton,
        Image, 
        Img,
        NotifSymbol,
        CaretSymbol
    } from "./style"

export function Chat(){
   
    return(
        <>
        <Container>
            <SearchPeople>
                <Decoration>
                    <SearchContainer>
                        <AiOutlineSearch />
                        <TitleSearch>Search User</TitleSearch>
                    </SearchContainer>
                    <Notification>
                        <NotifSymbol>
                            <AiFillBell />
                        </NotifSymbol>
                        <ProfileButton>
                            <Image>
                                <Img src={Thiago}/>
                            </Image>
                            <CaretSymbol>
                                <AiFillCaretDown />
                            </CaretSymbol>
                        </ProfileButton>
                    </Notification>
                </Decoration>
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