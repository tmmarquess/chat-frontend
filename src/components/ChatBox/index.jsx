import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
import { AESDecrypt, AESEncrypt, RSADecrypt, RSAEncrypt, signMessage, verifyMessage } from '../../utils/handleCrypto';

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

  const handleEnviarMensagem = async () => {
    const userData = JSON.parse(localStorage.getItem("userData")) || undefined;

    if (!userData) {
      navigate("/")
    }
    if (mensagemAtual.trim() !== '') {
      let encryptedMessage = '';
      if (chatEmail.includes('@')) {
        encryptedMessage = await RSAEncrypt(`${mensagemAtual}`, currentChatPubKey);
      } else {
        const groupKey = JSON.parse(localStorage.getItem(`privKey-${chatEmail}`));
        encryptedMessage = AESEncrypt(`${userData.name}: ${mensagemAtual}`, groupKey.k);

      }
      console.log(`mensagem criptografada ==> ${encryptedMessage}`);
      enviarMensagemLocal(mensagemAtual, true);

      const signature = await signMessage(encryptedMessage, localStorage.getItem("privateKey"));

      socket.emit("emitRoom", {
        senderEmail: userData.email,
        message: encryptedMessage,
        receiverId: chatEmail,
        signature: signature
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
      socket.once('isOnline', (onlineUser) => {
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

    socket.on("emitRoom", async (newMessage) => {
      const userData = JSON.parse(localStorage.getItem("userData")) || undefined;

      if (!userData) {
        navigate("/")
      }

      const messageVerified = verifyMessage(newMessage.message, newMessage.signature, newMessage.senderEmail, newMessage);
      if (messageVerified) {
        if (newMessage.senderEmail === chatEmail && newMessage.receiverId.includes('@')) {
          const decryptedMessage = await RSADecrypt(newMessage.message, localStorage.getItem('privateKey'));
          setMessageQueue((prevMensagens) => [
            ...prevMensagens,
            { texto: decryptedMessage, deUsuario: false, senderEmail: newMessage.senderEmail, receiverId: newMessage.receiverId },
          ]);
        }
        if (newMessage.receiverId === chatEmail && newMessage.senderEmail !== JSON.parse(localStorage.getItem("userData")).email) {
          const groupKey = JSON.parse(localStorage.getItem(`privKey-${newMessage.receiverId}`))
          const decryptedMessage = AESDecrypt(newMessage.message, groupKey.k);
          setMessageQueue((prevMensagens) => [
            ...prevMensagens,
            { texto: decryptedMessage, deUsuario: false, senderEmail: newMessage.senderEmail, receiverId: newMessage.receiverId },
          ]);
        }
      } else {
        console.log(`MENSAGEM RECEBIDA DE ${newMessage.senderEmail} NÃO VEIO DELE`);
        const decryptedMessage = await RSADecrypt(newMessage.message, localStorage.getItem('privateKey'));
        console.log(decryptedMessage);
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

