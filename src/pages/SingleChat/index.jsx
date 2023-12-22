import React, { useEffect, useState } from "react";
import { useParams } from 'react-router-dom';
import { Header } from "../../components/Header"
import { ChatBox } from "../../components/ChatBox";
import { SearchPeople, 
        Sidebar, 
        Container, 
        ChatScreen, 
        ContentCont, 
        Title, 
        ButtonGroup, 
        ContainerBar, 
        ContactContainer ,
        PeopleChat,
    } from "./style"

export function SingleChat(){
    const { nome } = useParams();
    const [nomesArmazenados, setNomesArmazenados] = useState([]);
    const [chatAtivo, setChatAtivo] = useState(null);

    useEffect(() => {
        const nomesLocalStorage = JSON.parse(localStorage.getItem('nomes')) || [];
        setNomesArmazenados(nomesLocalStorage);
    }, []); // Executar apenas uma vez no carregamento da página (esse caralho ta dando erro pqp)

    useEffect(() => {
        if (nome && !nomesArmazenados.includes(nome)) {
        const novosNomes = [...nomesArmazenados, nome];
        localStorage.setItem('nomes', JSON.stringify(novosNomes));
        setNomesArmazenados(novosNomes);
        }
    }, [nome, nomesArmazenados]);

    const toggleChat = (nomePessoa) => {
        setChatAtivo(chatAtivo === nomePessoa ? null : nomePessoa);
      };
    
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
                        {nomesArmazenados.map((pessoa, index) => (
                            <div key={index}>
                                <PeopleChat onClick={() => toggleChat(pessoa)}>{pessoa}</PeopleChat>
                            </div>
                        ))}
                    </ContactContainer>
                </Sidebar>
                <ChatScreen>
                    {nomesArmazenados.map((pessoa, index) => (
                            <div key={index}>
                                {chatAtivo === pessoa && (
                                    <ChatBox
                                        nome={pessoa}
                                        onClose={() => toggleChat(null)}
                                    />
                                )}
                            </div>
                        ))}
                </ChatScreen>
            </ContentCont>
        </Container>
        </>
    )
}