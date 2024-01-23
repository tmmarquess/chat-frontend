import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from 'react-router-dom';
import JSEncrypt from 'jsencrypt';
import CryptoJS from "crypto-js";
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

    const arrayBufferToPEM = (buffer, label) => {
        const uint8Array = new Uint8Array(buffer);
        const base64String = btoa(String.fromCharCode.apply(null, uint8Array));
        const pemString = `-----BEGIN ${label}-----\n${base64String}\n-----END ${label}-----\n`;
        return pemString;
    }

    const exportKeyPair = async (keys) => {
        const publicKeyExported = await crypto.subtle.exportKey('spki', keys.publicKey);
        const privateKeyExported = await crypto.subtle.exportKey('pkcs8', keys.privateKey);

        const publicKey = arrayBufferToPEM(publicKeyExported, 'PUBLIC KEY');
        const privateKey = arrayBufferToPEM(privateKeyExported, 'PRIVATE KEY');

        return { publicKey, privateKey };
    }

    const generateAESKey = async () => {
        const key = await crypto.subtle.generateKey({ name: 'AES-GCM', length: 256 }, true, ['encrypt', 'decrypt']);

        const exportedKey = await crypto.subtle.exportKey("jwk", key);

        return exportedKey;
    }

    useEffect(() => {
        const userData = JSON.parse(localStorage.getItem("userData")) || undefined;

        if (!userData) {
            navigate("/")
        }

        const privateKey = localStorage.getItem("privateKey") || undefined;
        const publicKey = localStorage.getItem("publicKey") || undefined;

        if (privateKey === undefined) {
            window.crypto.subtle.generateKey({
                name: 'RSA-OAEP',
                modulusLength: 2048,
                publicExponent: new Uint8Array([0x01, 0x00, 0x01]), // 65537
                hash: { name: 'SHA-256' },
            }, true, ['encrypt', 'decrypt']).then((keyPair) => {
                exportKeyPair(keyPair).then((keys) => {
                    const userData = JSON.parse(localStorage.getItem("userData")) || undefined;

                    localStorage.setItem("privateKey", keys.privateKey);
                    localStorage.setItem("publicKey", keys.publicKey);
                    socket.emit("setup", { userData, publicKey: keys.publicKey });
                });

            });
        } else {
            socket.emit("setup", { userData, publicKey });
        }

        socket.on("onKeySend", async (keyData) => {
            if (keyData.key === null) {
                const key = await generateAESKey();
                localStorage.setItem(`privKey-${keyData.groupId}`, JSON.stringify(key));
                socket.emit('joinRoom', keyData.groupId);
            } else {
                const decrypter = new JSEncrypt();
                decrypter.setPrivateKey(localStorage.getItem('privateKey'));
                const decryptedKey = decrypter.decrypt(keyData.key);
                console.log(decryptedKey);
                if (decryptedKey !== null && decryptedKey !== undefined) {
                    localStorage.setItem(`privKey-${keyData.groupId}`, decryptedKey);
                    socket.emit('joinRoom', keyData.groupId);
                }
            }
        })

        socket.on("requestGroupKey", (requestData) => {
            const groupKey = localStorage.getItem(`privKey-${requestData.groupId}`);
            console.log(`GROUP KEY TO ENCRYPT ==> ${groupKey}`);
            if (groupKey == null) {
                socket.emit("onKeySend", {
                    userEmail: requestData.requesterEmail,
                    groupId: requestData.groupId,
                    key: null
                });
            } else {
                const encrypter = new JSEncrypt();
                encrypter.setPublicKey(requestData.requesterPubKey);
                const encryptedKey = encrypter.encrypt(`${groupKey}`);
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
                    const groupKey = JSON.parse(localStorage.getItem(`privKey-${newMessage.receiverId}`)) || undefined
                    console.log(groupKey);
                    if (groupKey !== undefined) {
                        var bytes = CryptoJS.AES.decrypt(newMessage.message, groupKey.k);
                        var decryptedMessage = bytes.toString(CryptoJS.enc.Utf8);
                        setChatsQueue((prevMensagens) => [
                            ...prevMensagens,
                            { texto: decryptedMessage, deUsuario: false, senderEmail: newMessage.senderEmail, receiverId: newMessage.receiverId },
                        ]);
                    }
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
        setChatAtivo(chatAtivo === chatTarget ? null : chatTarget);
        navigate(`/chat/${chatTarget}`);
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