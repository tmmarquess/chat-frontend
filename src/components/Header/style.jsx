import styled from "styled-components"

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

export const ProfileButton = styled.div`
  margin-right: 20px;
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

export const SearchContainer = styled.div`
  margin-bottom: 30px;
`