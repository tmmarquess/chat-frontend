import React from "react";
import {AiFillCaretDown } from "react-icons/ai";
import Thiago from '../../img/Thiago.png'
import { SearchBar } from "../../components/SearchBar";

import { 
    Decoration, 
    ProfileButton,
    Image, 
    Img,
    CaretSymbol,
    SearchContainer
} from "./style"

export function Header(){
    return(
        <>
            <Decoration>
                <SearchContainer>
                    <SearchBar/>
                </SearchContainer>
                <ProfileButton>
                    <Image>
                        <Img src={Thiago}/>
                    </Image>
                    <CaretSymbol>
                        <AiFillCaretDown />
                    </CaretSymbol>
                </ProfileButton>
            </Decoration>
        </>
    )
}