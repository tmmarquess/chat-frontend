import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from 'react-router-dom';
import JSEncrypt from 'jsencrypt';
import { Header } from "../../components/Header"
import { ChatBox } from "../../components/ChatBox";
import { GroupChatButton } from "../../components/GroupChatButton";
import {
    SearchPeople,
    Sidebar,
    Container,
    ChatScreen,
    ContentCont,
    Title,
    ContainerBar,
    ContactContainer,
    PeopleChat,
    ButtonContainer
} from "./style"
import { ChatTitle } from "../Chat/style";
import { socket } from "../../services/socket";
import { api } from "../../services/axios";

export function SingleChat() {
    const navigate = useNavigate();
    const { chatEmail } = useParams();
    const [nomesArmazenados, setNomesArmazenados] = useState([]);
    const [novosNomesQueue, setNovosNomesQueue] = useState([]);
    const [ChatsQueue, setChatsQueue] = useState([]);
    const [saveGroups, setSaveGroups] = useState([]);
    const [chatAtivo, setChatAtivo] = useState(null);

    useEffect(() => {
        const nomesLocalStorage = JSON.parse(localStorage.getItem('nomes')) || [];

        if (nomesArmazenados.length === 0) {
            setNomesArmazenados(nomesLocalStorage);
        }

        if (chatEmail !== undefined) {
            if (chatEmail.trim().length !== 0 && !nomesLocalStorage.includes(chatEmail)) {
                let nameFound = false;
                for (const index in nomesLocalStorage) {
                    if (nomesLocalStorage[index].id === chatEmail) {
                        nameFound = true;
                        break;
                    }
                }

                if (!nameFound) {
                    const config = {
                        headers: {
                            'Authorization': `Bearer ${localStorage.getItem('userToken')}`
                        }
                    }

                    if (chatEmail.includes("@")) {
                        api.get(`users/get/${chatEmail}`, config).then((response) => {
                            const userData = response.data;

                            const novosNomes = [...nomesLocalStorage, userData];
                            localStorage.setItem('nomes', JSON.stringify(novosNomes));
                            setNomesArmazenados(novosNomes);
                            toggleChat(userData.id);
                        })
                    } else {
                        api.get(`users/groups/get/${chatEmail}`, config).then((response) => {
                            const groupData = response.data;

                            const novosNomes = [...nomesLocalStorage, groupData];
                            localStorage.setItem('nomes', JSON.stringify(novosNomes));
                            setNomesArmazenados(novosNomes);
                            toggleChat(groupData.id);
                        })
                    }
                }

            }
        }
        // eslint-disable-next-line
    }, [chatEmail]);

    useEffect(() => {
        const userData = JSON.parse(localStorage.getItem("userData")) || undefined;

        if (!userData) {
            navigate("/")
        }
        socket.emit("setup", userData);

        socket.on("connected", (groupsData) => {
            setSaveGroups(groupsData);
            for (const index in groupsData) {
                console.log(`emmitingAAAAAAAA ==> ${groupsData[index].id}`)
                socket.emit('joinRoom', groupsData[index].id);
            }
        })

        socket.on("emitRoom", (newMessage) => {
            const userData = JSON.parse(localStorage.getItem("userData")) || undefined;

            if (!userData) {
                navigate("/")
            }
            if (newMessage.senderEmail !== userData.email) {
                if (newMessage.receiverId.includes("@")) {
                    const decrypter = new JSEncrypt();
                    decrypter.setPrivateKey(localStorage.getItem('privateKey'));
                    const decryptedMessage = decrypter.decrypt(newMessage.message);
                    setChatsQueue((prevMensagens) => [
                        ...prevMensagens,
                        { texto: decryptedMessage, deUsuario: false, senderEmail: newMessage.senderEmail, receiverId: newMessage.receiverId },
                    ]);
                } else {
                    const decrypter = new JSEncrypt();
                    decrypter.setPrivateKey(localStorage.getItem(`privKey-${newMessage.receiverId}`));
                    const decryptedMessage = decrypter.decrypt(newMessage.message);
                    setChatsQueue((prevMensagens) => [
                        ...prevMensagens,
                        { texto: decryptedMessage, deUsuario: false, senderEmail: newMessage.senderEmail, receiverId: newMessage.receiverId },
                    ]);
                }

            }
        });
        // eslint-disable-next-line
    }, []);

    useEffect(() => {
        let currentMessage = ChatsQueue.pop();
        if (currentMessage) {
            if (currentMessage.receiverId.includes("@")) {
                setNovosNomesQueue([...novosNomesQueue, currentMessage.senderEmail]);
                const chatMessages = JSON.parse(localStorage.getItem(`messages-${currentMessage.senderEmail}`)) || []
                localStorage.setItem(`messages-${currentMessage.senderEmail}`, JSON.stringify([...chatMessages, { texto: currentMessage.texto, deUsuario: false }]));
            } else {
                setNovosNomesQueue([...novosNomesQueue, currentMessage.receiverId]);
                const chatMessages = JSON.parse(localStorage.getItem(`messages-${currentMessage.receiverId}`)) || []
                localStorage.setItem(`messages-${currentMessage.receiverId}`, JSON.stringify([...chatMessages, { texto: currentMessage.texto, deUsuario: false, senderEmail: currentMessage.senderEmail }]));
            }
        }
        // eslint-disable-next-line
    }, [ChatsQueue]);


    useEffect(() => {
        let currentName = novosNomesQueue.pop();
        if (currentName) {
            let nameFound = false;
            for (const index in nomesArmazenados) {
                if (nomesArmazenados[index].id === currentName) {
                    nameFound = true;
                    break;
                }
            }
            if (!nameFound) {
                const config = {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('userToken')}`
                    }
                }

                if (currentName.includes("@")) {
                    api.get(`users/get/${currentName}`, config).then((response) => {
                        const userData = response.data;

                        const novosNomes = [...nomesArmazenados, userData];
                        localStorage.setItem('nomes', JSON.stringify(novosNomes));
                        setNomesArmazenados(novosNomes);
                    })
                } else {
                    api.get(`users/groups/get/${currentName}`, config).then((response) => {
                        const groupData = response.data;

                        const novosNomes = [...nomesArmazenados, groupData];
                        localStorage.setItem('nomes', JSON.stringify(novosNomes));
                        setNomesArmazenados(novosNomes);
                    })
                }

            }
        }
        // eslint-disable-next-line
    }, [novosNomesQueue]);

    useEffect(() => {
        const data = []
        for (const index in saveGroups) {
            localStorage.setItem(`privKey-${saveGroups[index].id}`, saveGroups[index].privKey);
            let nameFound = false;
            for (const index2 in nomesArmazenados) {
                if (nomesArmazenados[index2].id === saveGroups[index].id) {
                    nameFound = true;
                    break;
                }
            }
            if (!nameFound) {
                data.push({ name: saveGroups[index].group_name, id: saveGroups[index].id })
            }
        }

        const novosNomes = [...JSON.parse(localStorage.getItem('nomes')) || [], ...data];
        localStorage.setItem('nomes', JSON.stringify(novosNomes));
        setNomesArmazenados(novosNomes);
        // eslint-disable-next-line
    }, [saveGroups])

    const toggleChat = (chatTarget) => {
        setChatAtivo(chatAtivo === chatTarget ? null : chatTarget);
        navigate(`/chat/${chatTarget}`);
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
                            <ButtonContainer>
                                <GroupChatButton />
                            </ButtonContainer>

                        </ContainerBar>
                        <ContactContainer>
                            {nomesArmazenados.map((pessoa, index) => (
                                <div key={index}>
                                    <PeopleChat onClick={() => toggleChat(pessoa.id)}>{pessoa.name}</PeopleChat>
                                </div>
                            ))}
                        </ContactContainer>
                    </Sidebar>
                    <ChatScreen>
                        {nomesArmazenados.length === 0 ? <ChatTitle>Click on a user to start chatting</ChatTitle> : nomesArmazenados.map((pessoa, index) => (
                            <div key={index}>
                                {chatAtivo === pessoa.id && (
                                    <ChatBox
                                        chatEmail={pessoa.id}
                                        setNovosNomesQueue={setNovosNomesQueue}
                                        novosNomesQueue={novosNomesQueue}
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