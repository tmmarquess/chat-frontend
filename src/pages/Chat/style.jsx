import styled from 'styled-components'

export const Container = styled.div`
  background: -webkit-linear-gradient(left, #0ebeff, #ff42b3);
  height: 100vh;
  font-family: Poppins;
  font-style: normal;
  font-weight: 400;
`

export const SearchPeople = styled.div`
    width: 100wh;
    height: 60px;
    margin-bottom: 20px;
    display: flex;
`
export const Decoration = styled.div`
  background: #fff;
  border-radius: 10px;
  margin-left: 15px;
  margin-right: 20px;
  margin-top: 12px; 
  margin-bottom: -5px;
  width: 1320px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`

export const SearchContainer = styled.div`
  margin-left: 20px;
  width: 150px;
  display: flex;
`

export const TitleSearch = styled.div`
  margin-left: 10px;
`

export const Notification = styled.div`
  margin-right: 15px;
  width: 160px;
  display: flex;
  ustify-content: space-between;
`
export const NotifSymbol = styled.div`
  font-size: 20px;
  height: 20px;
  margin-top: 13px;
  margin
`

export const ProfileButton = styled.div`
  margin-left: 20px;
  width: 120px;
  border-radius: 10px;
  background: #e3e3e3;
  display: flex;

  &:hover {
    background-color: #d0d0d0;
    cursor: pointer;
  }
`

export const Image = styled.div`
  width: 45px;
  height: 45px;
  border-radius: 22.5px;
  margin-left: 20px;
  margin-top: 2px;

`

export const Img = styled.img`
  border-radius: 22.5px;
  width: 45px;
  height: 45px;
  object-fit: contain;
`
export const CaretSymbol = styled.div`
  margin-left: 15px;
  height: 15px;
  margin-top: 15px;
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

export const ChatTitle = styled.p`
  font-size: 30px;
  display: inline-block;
  margin-top: 220px;
`