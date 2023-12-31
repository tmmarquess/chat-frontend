import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import JSEncrypt from 'jsencrypt';
import {
  ChatBoxContainer,
  MessageInput,
  MessageButton,
  InputChat,
  MessageChat,
  NameContainer,
  Name,
  BotMessage,
  UsuarioMessage
} from './style';
import { socket } from '../../services/socket';

export function ChatBox({ chatEmail, novosNomesQueue, setNovosNomesQueue }) {
  const navigate = useNavigate();
  const [mensagens, setMensagens] = useState([]);
  const [mensagemAtual, setMensagemAtual] = useState('');
  const [messageQueue, setMessageQueue] = useState([]);
  const [otherChatsQueue, setOtherChatsQueue] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [currentChatPubKey, setCurrentChatPubKey] = useState(undefined);

  const enviarMensagemLocal = (texto, deUsuario) => {
    setMensagens([...mensagens, { texto, deUsuario }]);
  };

  const handleEnviarMensagem = () => {
    const userData = JSON.parse(localStorage.getItem("userData")) || undefined;

    if (!userData) {
      navigate("/")
    }
    if (mensagemAtual.trim() !== '') {
      const encrypter = new JSEncrypt();
      encrypter.setPublicKey(currentChatPubKey);
      console.log(currentChatPubKey);
      const encryptedMessage = encrypter.encrypt(mensagemAtual);
      console.log(encryptedMessage);

      enviarMensagemLocal(mensagemAtual, true);
      // enviarMensagemBot();
      socket.emit("emitRoom", {
        senderEmail: userData.email,
        message: encryptedMessage,
        timestamp: Date.now(),
        receiverId: chatEmail,
      });
      setMensagemAtual('');
    }
  };

  useEffect(() => {
    const savedMessages = JSON.parse(localStorage.getItem(`messages-${chatEmail}`)) || [];
    setMensagens(savedMessages);

    const currentChatPublicKey = localStorage.getItem(`pubkey-${chatEmail}`) || undefined;

    if (!currentChatPublicKey) {
      socket.on('getPubKey', (chatPubKey) => {

        setCurrentChatPubKey(chatPubKey);
      })
      socket.emit('sendPubKey', chatEmail);
    }

    // socket.on("connected", () => setSocketConnected(true));

    socket.on("typing", () => setIsTyping(true));
    socket.on("stop typing", () => setIsTyping(false));

    socket.on("emitRoom", (newMessage) => {
      const userData = JSON.parse(localStorage.getItem("userData")) || undefined;

      if (!userData) {
        navigate("/")
      }

      if (newMessage.senderEmail === chatEmail) {
        const decrypter = new JSEncrypt();
        decrypter.setPrivateKey(localStorage.getItem('privateKey'));
        const decryptedMessage = decrypter.decrypt(newMessage.message);
        setMessageQueue((prevMensagens) => [
          ...prevMensagens,
          { texto: decryptedMessage, deUsuario: false },
        ]);
      }
    });
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    let currentMessage = messageQueue.pop();
    if (currentMessage) {
      setMensagens((prevMensagens) => [...prevMensagens, currentMessage]);
    }
  }, [messageQueue]);

  useEffect(() => {
    let currentMessage = otherChatsQueue.pop();
    if (currentMessage) {
      setNovosNomesQueue([...novosNomesQueue, currentMessage.senderEmail]);
      const chatMessages = JSON.parse(localStorage.getItem(`messages-${currentMessage.senderEmail}`)) || []
      localStorage.setItem(`messages-${currentMessage.senderEmail}`, JSON.stringify([...chatMessages, { texto: currentMessage.texto, deUsuario: false }]));
    }
    // eslint-disable-next-line
  }, [otherChatsQueue]);

  useEffect(() => {
    if (mensagens.length !== 0) {
      localStorage.setItem(`messages-${chatEmail}`, JSON.stringify(mensagens));
    }
    // eslint-disable-next-line
  }, [mensagens]);

  return (
    <>
      <ChatBoxContainer>
        <NameContainer>
          <Name>{chatEmail}</Name>
        </NameContainer>
        <MessageChat>
          {mensagens.map((mensagem, index) => (
            <React.Fragment key={index}>
              {mensagem.deUsuario ? (
                <UsuarioMessage>{mensagem.texto}</UsuarioMessage>
              ) : (
                <BotMessage>{mensagem.texto}</BotMessage>
              )}
            </React.Fragment>
          ))}
        </MessageChat>
        <InputChat>
          <MessageInput
            type="text"
            value={mensagemAtual}
            onChange={(e) => setMensagemAtual(e.target.value)}
          />
          <MessageButton onClick={handleEnviarMensagem}>Enviar</MessageButton>
        </InputChat>
      </ChatBoxContainer>
    </>
  );
};

