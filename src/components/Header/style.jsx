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
  width: 100px;
  border-radius: 10px;
  background: #e3e3e3;
  display: flex;
  align-items: center;
  height: 30px;
  justify-content: center;

  &:hover {
    background-color: #d0d0d0;
    cursor: pointer;
  }
`

export const CaretSymbol = styled.div`
  margin-left: 15px;
  height: 15px;
  margin-top: 15px;
`

export const SearchContainer = styled.div`
  margin-bottom: 30px;
`

export const DropdownContainer = styled.div`
  position: relative;
  display: inline-block;
`;

