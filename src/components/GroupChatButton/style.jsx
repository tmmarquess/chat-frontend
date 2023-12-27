import styled from "styled-components";

export const ButtonGroup = styled.button`
  margin-top: 17px;
  border: none;
  background: #f0f0f0;
  border-radius: 5px;
  width: 180px;
  height: 40px;

  &:hover {
    background-color: #d0d0d0;
    cursor: pointer;
  }
`

export const Popup = styled.div`
  display: ${(props) => (props.isOpen ? 'block' : 'none')};
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  padding: 20px 65px;

  background-color: #fff;
  border: 1px solid #ccc;
  z-index: 1000;
  max-height: 80vh;
  overflow-y: auto;
  border-radius: 10px;
`;

export const Title = styled.h2`
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: Poppins;
`;

export const Input = styled.input`
  margin-top: 5px;
  padding: 2px 15px;

`

export const GroupTitle = styled.label`

`

export const ScrollableList = styled.div`
  margin-top: 5px;
  max-height: 200px;
  overflow-y: auto;
  margin-bottom: 10px;
`;

export const CheckboxLabel = styled.label`
  display: block;
  margin-bottom: 8px;
`;

export const Checkbox = styled.input`
  margin-right: 8px;
`;

export const CancelButton = styled.button`
  background-color: #e74c3c;
  color: #fff;
  padding: 10px 15px;
  font-size: 14px;
  border: none;
  cursor: pointer;
  margin-right: 10px;
`;

export const CreateButton = styled.button`
  background-color: #2ebb45;
  color: #fff;
  padding: 10px 15px;
  font-size: 14px;
  border: none;
  cursor: pointer;
`;

