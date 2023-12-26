import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from 'react-router-dom';
import { Header } from "../../components/Header"
import { ChatBox } from "../../components/ChatBox";
import {
    SearchPeople,
    Sidebar,
    Container,
    ChatScreen,
    ContentCont,
    Title,
    ButtonGroup,
    ContainerBar,
    ContactContainer,
    PeopleChat,
} from "./style"
import { ChatTitle } from "../Chat/style";

export function SingleChat() {
    const navigate = useNavigate();
    const { chatEmail } = useParams();
    const [nomesArmazenados, setNomesArmazenados] = useState([]);
    const [chatAtivo, setChatAtivo] = useState(null);

    useEffect(() => {
        const nomesLocalStorage = JSON.parse(localStorage.getItem('nomes')) || [];

        if (nomesArmazenados.length === 0) {
            setNomesArmazenados(nomesLocalStorage);
        }

        if (chatEmail !== undefined) {
            if (chatEmail.trim().length !== 0 && !nomesLocalStorage.includes(chatEmail)) {
                const novosNomes = [...nomesLocalStorage, chatEmail];
                localStorage.setItem('nomes', JSON.stringify(novosNomes));
                setNomesArmazenados(novosNomes);
            }
        }
        // eslint-disable-next-line
    }, [chatEmail]);

    const toggleChat = (emailPessoa) => {
        setChatAtivo(chatAtivo === emailPessoa ? null : emailPessoa);
        navigate(`/chat/${emailPessoa}`);
    };

    return (
        <>
            <Container>
                <SearchPeople>
                    <Header />
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
                        {nomesArmazenados.length === 0 ? <ChatTitle>Click on a user to start chatting</ChatTitle> : nomesArmazenados.map((pessoa, index) => (
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