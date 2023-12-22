import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { 
    ChatBoxContainer, 
    MessageInput, 
    MessageButton,
    InputChat,
    MessageChat,
    NameContainer,
    Name 
  } from './style';

export function ChatBox () {
  const { nome } = useParams();
  const [mensagens, setMensagens] = useState([]);
  const [mensagemAtual, setMensagemAtual] = useState('');

  const enviarMensagemLocal = (texto, deUsuario) => {
    setMensagens([...mensagens, { texto, deUsuario }]);
  };

  const enviarMensagemBot = () => {
    // Simulação de uma resposta do bot após um pequeno atraso
    setTimeout(() => {
      const respostaBot = 'Resposta do Bot: Olá! Como posso ajudar?';
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
    <ChatBoxContainer>
      <NameContainer>
        <Name>{nome}</Name>
      </NameContainer>
      <MessageChat>
        {mensagens.map((mensagem, index) => (
          <div key={index} className={mensagem.deUsuario ? 'usuario' : 'bot'}>
            {mensagem.texto}
          </div>
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
  );
};

