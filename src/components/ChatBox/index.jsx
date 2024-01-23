import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import JSEncrypt from 'jsencrypt';
import CryptoJS from 'crypto-js'
import {
  ChatBoxContainer,
  MessageInput,
  MessageButton,
  InputChat,
  MessageChat,
  NameContainer,
  Name,
  BotMessage,
  UsuarioMessage,
  ExitGroupButton
} from './style';
import { socket } from '../../services/socket';

export function ChatBox({ chatEmail, handleGroupExit }) {
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
      let encryptedMessage = '';
      if (chatEmail.includes('@')) {
        const encrypter = new JSEncrypt();
        encrypter.setPublicKey(currentChatPubKey);
        console.log(currentChatPubKey);
        encryptedMessage = encrypter.encrypt(`${mensagemAtual}`);
      } else {
        const groupKey = JSON.parse(localStorage.getItem(`privKey-${chatEmail}`))
        encryptedMessage = CryptoJS.AES.encrypt(`${userData.name}: ${mensagemAtual}`, groupKey.k).toString();

      }
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
      const privateKey = JSON.parse(localStorage.getItem(`privKey-${chatEmail}`)) || undefined;
      console.log(`${chatEmail} private key ==> ${JSON.stringify(privateKey)}`);
      setIsOnline(true);
    } else {
      socket.on('isOnline', (onlineUser) => {
        if (onlineUser.email === chatEmail) {
          setIsOnline(onlineUser.online);
          if (onlineUser.online) {
            console.log(`${chatEmail} public key ==> ${onlineUser.pubkey}`);
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
        const groupKey = JSON.parse(localStorage.getItem(`privKey-${newMessage.receiverId}`))
        var bytes = CryptoJS.AES.decrypt(newMessage.message, groupKey.k);
        var decryptedMessage = bytes.toString(CryptoJS.enc.Utf8);
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
          {chatEmail.includes('@') ? (
            <Name>{chatEmail}</Name>
          ) : (
            <>
              <Name>{chatEmail}</Name>
              <ExitGroupButton onClick={handleGroupExit}>exit group</ExitGroupButton>
            </>
          )}
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

