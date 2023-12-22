import React from "react";
import { Link } from "react-router-dom";
import { Container, 
        LoginContainer, 
        Title, 
        LabelTitle, 
        Input, 
        InputSubmit,
        RegisterTitle
    } from "./style";

export function Login() {
    return(
        <>
        <Container>
            <LoginContainer>
                <Title>login</Title>
                <LabelTitle>email</LabelTitle>
                <Input type="email" required/> 
                <LabelTitle>password</LabelTitle>
                <Input type="password" required/>  <br />
                <InputSubmit type="submit" value="log in"/>

                <RegisterTitle>
                    Don't have an account?  
                    <Link to="/createAccount" style={{
                        textDecoration: 'none',
                        color: 'black',
                        fontWeight:'600',
                        }}>
                         Register now
                    </Link>
                </RegisterTitle>
            </LoginContainer>

        </Container>
        </>
    )
}