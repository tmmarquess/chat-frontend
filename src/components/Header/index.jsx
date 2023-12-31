import React from "react";
import { SearchBar } from "../../components/SearchBar"
import { Link } from "react-router-dom";

import {
    Decoration,
    ProfileButton,
    SearchContainer,
    DropdownContainer
} from "./style"

export function Header() {
    return (
        <>
            <Decoration>
                <SearchContainer>
                    <SearchBar />
                </SearchContainer>
                <DropdownContainer>
                    <ProfileButton>
                        <Link to="/" style={{
                            textDecoration: 'none',
                            color: 'black'
                        }}>
                            log out
                        </Link>
                    </ProfileButton>

                </DropdownContainer>
            </Decoration>
        </>
    )
}