import styled from "styled-components";

export const Container = styled.div`
  background: -webkit-linear-gradient(left, #0ebeff, #ff42b3);
  height: 100vh;
  font-family: Poppins;
  font-style: normal;
  font-weight: 400;
  position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%)
`

export const SearchPeople = styled.div`
    width: 100wh;
    height: 60px;
    margin-bottom: 20px;
    display: flex;
`

export const TitleSearch = styled.div`
  margin-left: 10px;
`

export const ContentCont = styled.div`
  display: flex;
  height: 510px;
`

export const Sidebar = styled.div`
  border-radius: 2%;
  background: #fff;
  margin-left: 15px;
  width: 420px;
  margin-right: 15px;
`
export const ContainerBar = styled.div`
  display: flex;
  margin-left: 25px;
  margin-right: 25px;
  justify-content: space-between;
  margin-bottom: 15px;
  height: 60px;
`

export const Title = styled.p`
  margin-top: 17px;
  font-size: 30px;
`

export const ButtonGroup = styled.button`
  margin-top: 17px;
  border: none;
  background: #f0f0f0;
  border-radius: 5px;
  width: 180px;
  height: 40px;
`

export const ContactContainer = styled.div`
  background: #f5f5f5;
  height: 400px;
  margin-top: 30px;
  margin-left: 15px;
  margin-right: 15px;
  border-radius: 2%;
`

export const ChatScreen = styled.div`
  border-radius: 2%;
  background: #fff;
  width: 860px;
  text-align: center;
`

export const PeopleChat  = styled.button`
    margin-top: 5px;
    margin-left: 15px;
    width: 358px;
    height: 30px;
    display: flex;
    border-radius: 5px;
    background: #008489;
    color: white;
    font-family: Poppins;
    font-size: 16px;
    padding-top: 5px;
    padding-left: 10px;
    border: none;

    &:hover {
      background-color: #008470;
      cursor: pointer;
    }
`