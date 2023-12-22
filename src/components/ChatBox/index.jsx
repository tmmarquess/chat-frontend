import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
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

export function ChatBox () {
  const { nome } = useParams();
  const [mensagens, setMensagens] = useState([]);
  const [mensagemAtual, setMensagemAtual] = useState('');

  const enviarMensagemLocal = (texto, deUsuario) => {
    setMensagens([...mensagens, { texto, deUsuario }]);
  };

  const enviarMensagemBot = () => {
    // Simulação de uma resposta do bot com um delay
    setTimeout(() => {
      const respostaBot = 'Thiago eu n aguento mais, a minha costa ta latejando aaaa eu quero férias';
      setMensagens((prevMensagens) => [
        ...prevMensagens,
        { texto: respostaBot, deUsuario: false },
      ]);
    }, 1000);
  };

  const handleEnviarMensagem = () => {
    if (mensagemAtual.trim() !== '') {
      enviarMensagemLocal(mensagemAtual, true);
      setMensagemAtual('');
      enviarMensagemBot();
    }
  };

  useEffect(() => {
    enviarMensagemBot(); // Envia uma mensagem do bot quando o chat é aberto
  }, []);

  return (
    <>
    <ChatBoxContainer>
      <NameContainer>
        <Name>{nome}</Name>
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

