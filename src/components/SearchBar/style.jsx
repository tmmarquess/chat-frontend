import styled from "styled-components";

export const SearchContainer = styled.div`
    display: flex;
    position: absolute;
    margin-left: 20px;
`

export const InputSearch = styled.input`
    width: 300px;
    height: 25px;
    border-radius: 10px;
    font-family: Poppins;
    font-size: 15px;
    padding-left: 15px;
    border: 1px solid black;
`

export const SearchButton = styled.button`
    margin-left: 10px;
    margin-top: 2px;
    width: 70px;
    border: none;
    border-radius: 5px;
    height: 25px;
    border: 1px solid black;
    cursor: pointer;
`
export const EmailList = styled.ul`
    position: absolute;
    top: 100%;
    left: 0;
    width: 300px;
    max-height: 200px;
    overflow-y: auto;
    list-style: none;
    padding: 0;
    margin: 0;
    border: 1px solid #ddd;
    border-top: none;
    border-radius: 0 0 4px 4px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    background-color: #fff;
`
export const ElementsList = styled.li`
    padding: 8px;
    cursor: pointer;
    transition: background-color 0.3s;

    &:hover {
        background-color: #f0f0f0;
      }
`