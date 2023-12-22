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

export const DropdownContainer = styled.div`
  position: relative;
  display: inline-block;
`;

export const DropdownContent = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  background-color: #fff;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 8px;
  z-index: 1;
`;

export const StyledList = styled.ul`
  top: 100%;
  left: 0;
  width: 100px;
  list-style: none;
  padding: 0;
  margin: 0;
  border-top: none;
  cursor: pointer;
  background-color: white;
  transition: background-color 0.3s;

  &:hover {
      background-color: #f0f0f0;
    }
`;
