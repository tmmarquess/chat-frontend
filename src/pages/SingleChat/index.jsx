import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from 'react-router-dom';
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
import { AESDecrypt, RSADecrypt, RSAEncrypt, generateAESKey, generateKeypair, verifyMessage } from "../../utils/handleCrypto";

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
                            groupData.name = `[grupo] ${groupData.name}`;

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

        const privateKey = localStorage.getItem("privateKey") || undefined;
        const publicKey = localStorage.getItem("publicKey") || undefined;

        if (privateKey === undefined) {
            generateKeypair().then((keys) => {
                const userData = JSON.parse(localStorage.getItem("userData")) || undefined;

                localStorage.setItem("privateKey", keys.privateKey);
                localStorage.setItem("publicKey", keys.publicKey);
                socket.emit("setup", { userData, publicKey: keys.publicKey });
            })
        } else {
            socket.emit("setup", { userData, publicKey });
        }

        socket.on("onKeySend", async (keyData) => {
            const currentKey = localStorage.getItem(`privKey-${keyData.groupId}`) || undefined
            if (keyData.key === null) {
                if (currentKey === undefined) {
                    const key = await generateAESKey();
                    localStorage.setItem(`privKey-${keyData.groupId}`, JSON.stringify(key));
                    console.log(`KEY GERADA ==> ${JSON.stringify(key)}`);
                }
            } else {
                const decryptedKey = await RSADecrypt(keyData.key, localStorage.getItem('privateKey'));
                console.log(`KEY RECEBIDA ==> ${decryptedKey}`);
                if (decryptedKey !== null && decryptedKey !== undefined) {
                    localStorage.setItem(`privKey-${keyData.groupId}`, decryptedKey);
                }
            }
            socket.emit('joinRoom', keyData.groupId);
        })

        socket.on("requestGroupKey", async (requestData) => {
            const groupKey = localStorage.getItem(`privKey-${requestData.groupId}`);
            console.log(`GROUP KEY TO ENCRYPT ==> ${groupKey}`);
            if (groupKey == null) {
                socket.emit("onKeySend", {
                    userEmail: requestData.requesterEmail,
                    groupId: requestData.groupId,
                    key: null
                });
            } else {
                const encryptedKey = await RSAEncrypt(`${groupKey}`, requestData.requesterPubKey);
                console.log(`ENCRYPTED KEY ==> ${encryptedKey}`);

                socket.emit("onKeySend", {
                    userEmail: requestData.requesterEmail,
                    groupId: requestData.groupId,
                    key: encryptedKey
                });
            }
        })

        socket.on("connected", (groupsData) => {
            setSaveGroups(groupsData);
        })

        socket.on("emitRoom", async (newMessage) => {
            const userData = JSON.parse(localStorage.getItem("userData")) || undefined;

            if (!userData) {
                navigate("/")
            }

            if (newMessage.senderEmail !== userData.email && newMessage.senderEmail !== chatAtivo) {

                const messageVerified = await verifyMessage(newMessage.message, newMessage.signature, newMessage.senderEmail, newMessage);

                if (messageVerified) {
                    if (newMessage.receiverId.includes("@")) {
                        const decryptedMessage = await RSADecrypt(newMessage.message, localStorage.getItem('privateKey'));
                        console.log(decryptedMessage);
                        setChatsQueue((prevMensagens) => [
                            ...prevMensagens,
                            { texto: decryptedMessage, deUsuario: false, senderEmail: newMessage.senderEmail, receiverId: newMessage.receiverId },
                        ]);
                    } else {
                        const groupKey = JSON.parse(localStorage.getItem(`privKey-${newMessage.receiverId}`)) || undefined
                        console.log(groupKey);
                        if (groupKey !== undefined) {
                            const decryptedMessage = AESDecrypt(newMessage.message, groupKey.k);
                            setChatsQueue((prevMensagens) => [
                                ...prevMensagens,
                                { texto: decryptedMessage, deUsuario: false, senderEmail: newMessage.senderEmail, receiverId: newMessage.receiverId },
                            ]);
                        }
                    }
                } else {
                    console.log(`MENSAGEM RECEBIDA DE ${newMessage.senderEmail} NÃO VEIO DELE`);
                    const decryptedMessage = await RSADecrypt(newMessage.message, localStorage.getItem('privateKey'));
                    console.log(decryptedMessage);
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
                const chatMessages = JSON.parse(localStorage.getItem(`messages-${currentMessage.senderEmail}`)) || [];
                if (chatMessages.length === 0) {
                    localStorage.setItem(`messages-${currentMessage.senderEmail}`, JSON.stringify([...chatMessages, { texto: currentMessage.texto, deUsuario: false }]));
                } else {
                    if (currentMessage.texto !== chatMessages[chatMessages.length - 1].texto) {
                        localStorage.setItem(`messages-${currentMessage.senderEmail}`, JSON.stringify([...chatMessages, { texto: currentMessage.texto, deUsuario: false }]));
                    }
                }

            } else {
                setNovosNomesQueue([...novosNomesQueue, currentMessage.receiverId]);
                const chatMessages = JSON.parse(localStorage.getItem(`messages-${currentMessage.receiverId}`)) || []
                if (chatMessages.length === 0) {
                    localStorage.setItem(`messages-${currentMessage.receiverId}`, JSON.stringify([...chatMessages, { texto: currentMessage.texto, deUsuario: false, senderEmail: currentMessage.senderEmail }]));
                } else {
                    if (currentMessage.texto !== chatMessages[chatMessages.length - 1].texto) {
                        localStorage.setItem(`messages-${currentMessage.receiverId}`, JSON.stringify([...chatMessages, { texto: currentMessage.texto, deUsuario: false, senderEmail: currentMessage.senderEmail }]));
                    }
                }

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
        const userData = JSON.parse(localStorage.getItem("userData")) || undefined;
        const data = []
        for (const index in saveGroups) {
            const groupKey = localStorage.getItem(`privKey-${saveGroups[index].id}`) || undefined;
            if (groupKey === undefined) {
                socket.emit("requestGroupKey", {
                    groupId: saveGroups[index].id,
                    requesterEmail: userData.email,
                    requesterPubKey: localStorage.getItem("publicKey")
                })
            }

            let nameFound = false;
            for (const index2 in nomesArmazenados) {
                if (nomesArmazenados[index2].id === saveGroups[index].id) {
                    nameFound = true;
                    break;
                }
            }
            if (!nameFound) {
                data.push({ name: `[grupo] ${saveGroups[index].group_name}`, id: saveGroups[index].id })
            }
        }

        const novosNomes = [...JSON.parse(localStorage.getItem('nomes')) || [], ...data];
        localStorage.setItem('nomes', JSON.stringify(novosNomes));
        setNomesArmazenados(novosNomes);
        // eslint-disable-next-line
    }, [saveGroups])

    const toggleChat = (chatTarget) => {
        const target = chatAtivo === chatTarget ? null : chatTarget;
        setChatAtivo(target);
        navigate(`/chat/${target === null ? "" : target}`);
    };


    const handleGroupExit = () => {
        // mandar pro websocket & deletar o grupo & as mensagens k
        const userData = JSON.parse(localStorage.getItem("userData")) || undefined;
        socket.emit("leaveGroup", {
            groupId: chatEmail,
            userEmail: userData.email,
        })
        navigate("/chat");
        setNomesArmazenados(nomesArmazenados.filter((chat) => { return chat.id !== chatEmail }))
        localStorage.setItem(`messages-${chatEmail}`, JSON.stringify([]));
    }

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
                                        handleGroupExit={handleGroupExit}
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