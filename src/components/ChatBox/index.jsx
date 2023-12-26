import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import io from "socket.io-client";
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


let socket;

export function ChatBox() {
  const navigate = useNavigate();
  const { chatEmail } = useParams();
  const [mensagens, setMensagens] = useState([]);
  const [mensagemAtual, setMensagemAtual] = useState('');
  const [messageQueue, setMessageQueue] = useState([]);
  const [isTyping, setIsTyping] = useState(false);

  const enviarMensagemLocal = (texto, deUsuario) => {
    setMensagens([...mensagens, { texto, deUsuario }]);
  };

  const handleEnviarMensagem = () => {
    const userData = JSON.parse(localStorage.getItem("userData")) || undefined;

    if (!userData) {
      navigate("/")
    }

    if (mensagemAtual.trim() !== '') {
      enviarMensagemLocal(mensagemAtual, true);
      // enviarMensagemBot();
      socket.emit("emitRoom", {
        senderEmail: userData.email,
        message: mensagemAtual,
        receiverId: chatEmail,
      });
      setMensagemAtual('');
    }
  };

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("userData")) || undefined;

    if (!userData) {
      navigate("/")
    }

    socket = io(process.env.REACT_APP_BACKEND_BASE_URL);
    socket.emit("setup", userData);
    // socket.on("connected", () => setSocketConnected(true));

    socket.on("typing", () => setIsTyping(true));
    socket.on("stop typing", () => setIsTyping(false));

    socket.on("emitRoom", (newMessage) => {
      const userData = JSON.parse(localStorage.getItem("userData")) || undefined;

      if (!userData) {
        navigate("/")
      }

      if (newMessage.senderEmail === chatEmail) {
        setMessageQueue((prevMensagens) => [
          ...prevMensagens,
          { texto: newMessage.message, deUsuario: false },
        ]);
      }
    });

    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    let currentMessage = messageQueue.pop();
    if (currentMessage) {
      setMensagens((prevMensagens) => [...prevMensagens, currentMessage])
    }
  }, [messageQueue]);

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

