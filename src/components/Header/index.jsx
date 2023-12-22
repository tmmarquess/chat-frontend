import React, { useState } from "react";
import Thiago from '../../img/Thiago.png'
import { SearchBar } from "../../components/SearchBar"
import { Link } from "react-router-dom";
import { CaretSymbol } from "./style";
import {AiFillCaretDown } from "react-icons/ai";

import { 
    Decoration, 
    ProfileButton,
    Image, 
    Img,
    SearchContainer,
    DropdownContainer,
    DropdownContent,
    StyledList,
} from "./style"

export function Header(){

    const [isDropdownOpen, setDropdownOpen] = useState(false);

    const toggleDropdown = () => {
        setDropdownOpen(!isDropdownOpen);
    };

    return(
        <>
            <Decoration>
                <SearchContainer>
                    <SearchBar/>
                </SearchContainer>
                <DropdownContainer>
                    <ProfileButton  onClick={toggleDropdown}>
                        <Image>
                            <Img src={Thiago}/>
                        </Image>
                        <CaretSymbol>
                            <AiFillCaretDown />
                        </CaretSymbol>
                    </ProfileButton>
                    
                    {isDropdownOpen && (
                        <DropdownContent>
                            <StyledList>
                                <Link to="/login" style={{
                                    textDecoration: 'none',
                                    color: 'black'
                                }}>
                                    log out
                                </Link>
                            </StyledList>
                        </DropdownContent>
                    )}
                </DropdownContainer>
            </Decoration>
        </>
    )
}