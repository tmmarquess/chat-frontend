import styled from "styled-components";


export const ChatBoxContainer = styled.div`
  max-height: 480px; 
  overflow-y: auto;
  padding: 10px; 
  border-radius: 8px;
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

export const  MessageInput = styled.input`
  width: 500px;
`

export const MessageButton = styled.button`
  border: 1px solid black;
`

export const InputChat = styled.div`
  display: flex;
  justify-content: flex-start;
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