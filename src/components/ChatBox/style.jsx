import styled from "styled-components";


export const ChatBoxContainer = styled.div`
  max-height: 480px; 
  overflow-y: auto;
  padding: 10px; 
  display: flex;
  flex-direction: column;

`

export const MessageChat = styled.div`
  height: 800px; 
  overflow-y: auto;
  border: 1px solid #ccc; 
  padding: 10px; 
  border-radius: 8px; 
`

export const MessageInput = styled.input`
  width: 750px;
  height: 25px;
  border: 1px solid black;
  border-radius: 5px;
`

export const MessageButton = styled.button`
  border: none;
  border: 1px solid black;
  margin-left: 5px;
  border-radius: 5px;
  width: 76px;
`

export const InputChat = styled.div`
  display: flex;
  justify-content: flex-start;
  border: none;
  border: 1
`

export const NameContainer = styled.div`
  height: 35px;
`
export const Name = styled.p`
  display: flex;
  justify-content: flex-start;
  font-size: 26px;
  margin-top: 4px;
  margin-left: 10px;
`

export const MessageStyle = styled.div`
  margin-top: 10px;
  
`

const MessageContainer = styled.div`
  margin-bottom: 8px;
  padding: 8px;
  border-radius: 8px;
`;

export const UsuarioMessage = styled(MessageContainer)`
  background-color: #87CEEB;
  color: #000000;
  text-align: right;
  width: 300px;
  margin-left: 470px;

`;

export const BotMessage = styled(MessageContainer)`
  background-color: #DDDDDD;
  color: #000000;
  text-align: left;
  width: 300px;
`;
