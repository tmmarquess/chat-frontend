import React from "react";
import { SearchBar } from "../../components/SearchBar"
import { Link } from "react-router-dom";

import {
    Decoration,
    ProfileButton,
    SearchContainer,
    DropdownContainer
} from "./style"
import { socket } from "../../services/socket";

export function Header() {

    const logOut = () => {
        socket.emit("logout", JSON.parse(localStorage.getItem("userData")).email);
    }

    return (
        <>
            <Decoration>
                <SearchContainer>
                    <SearchBar />
                </SearchContainer>
                <DropdownContainer>
                    <ProfileButton>
                        <Link to='/' onClick={logOut} style={{
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