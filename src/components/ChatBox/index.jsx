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
  const [isOnline, setIsOnline] = useState(false);
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
      let encryptedMessage = '';
      if (chatEmail.includes('@')) {
        encryptedMessage = encrypter.encrypt(`${mensagemAtual}`);
      } else {
        encryptedMessage = encrypter.encrypt(`${userData.name}: ${mensagemAtual}`);
      }
      console.log(currentChatPubKey);
      console.log(`mensagem criptografada ==> ${encryptedMessage}`);
      enviarMensagemLocal(mensagemAtual, true);
      // enviarMensagemBot();
      socket.emit("emitRoom", {
        senderEmail: userData.email,
        message: encryptedMessage,
        receiverId: chatEmail,
      });
      setMensagemAtual('');
    }
  };

  useEffect(() => {
    const savedMessages = JSON.parse(localStorage.getItem(`messages-${chatEmail}`)) || [];
    setMensagens(savedMessages);

    if (!chatEmail.includes('@')) {
      const privateKey = localStorage.getItem(`privKey-${chatEmail}`);
      console.log(`${chatEmail} private key ==> ${privateKey}`);
      setIsOnline(true);
    } else {
      socket.on('isOnline', (onlineUser) => {
        if (onlineUser.email === chatEmail) {
          setIsOnline(onlineUser.online);
          if (onlineUser.online) {
            setCurrentChatPubKey(onlineUser.pubkey);
          }
        }
      })
      socket.emit('isOnline', chatEmail);
    }

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
          { texto: decryptedMessage, deUsuario: false, senderEmail: newMessage.senderEmail, receiverId: newMessage.receiverId },
        ]);
      }
      if (newMessage.receiverId === chatEmail && newMessage.senderEmail !== JSON.parse(localStorage.getItem("userData")).email) {
        const decrypter = new JSEncrypt();
        decrypter.setPrivateKey(localStorage.getItem(`privKey-${chatEmail}`));
        const decryptedMessage = decrypter.decrypt(newMessage.message);
        setMessageQueue((prevMensagens) => [
          ...prevMensagens,
          { texto: decryptedMessage, deUsuario: false, senderEmail: newMessage.senderEmail, receiverId: newMessage.receiverId },
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
            value={isOnline ? mensagemAtual : "Usuário Offline"}
            onChange={(e) => setMensagemAtual(e.target.value)}
            disabled={!isOnline}
          />
          <MessageButton onClick={handleEnviarMensagem} disabled={!isOnline}>Enviar</MessageButton>
        </InputChat>
      </ChatBoxContainer >
    </>
  );
};

