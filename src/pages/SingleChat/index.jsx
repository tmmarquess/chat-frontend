import React, { useEffect, useState } from "react";
import { useParams } from 'react-router-dom';
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
        PeopleChat,
    } from "./style"

export function SingleChat(){
    const { nome } = useParams();
    const [nomesArmazenados, setNomesArmazenados] = useState([]);

    useEffect(() => {
        const nomesLocalStorage = JSON.parse(localStorage.getItem('nomes')) || [];
        setNomesArmazenados(nomesLocalStorage);
    }, []); // Executar apenas uma vez no carregamento da página

    useEffect(() => {
        if (nome && !nomesArmazenados.includes(nome)) {
        const novosNomes = [...nomesArmazenados, nome];
        localStorage.setItem('nomes', JSON.stringify(novosNomes));
        setNomesArmazenados(novosNomes);
        }
    }, [nome, nomesArmazenados]);

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
                        {nomesArmazenados.map((nomeArmazenado, index) => (
                            <PeopleChat key={index}>{nomeArmazenado}</PeopleChat>
                        ))}
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