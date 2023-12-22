import React from "react";
import { Link } from "react-router-dom";
import { Container, 
        SignUpContainer, 
        Title, 
        LabelTitle, 
        Input, 
        InputSubmit,
        RegisterTitle
    } from "./style";

export function createAccount() {
    return(
        <>
        <Container>
            <SignUpContainer>
                <Title>Create Account</Title>
                <LabelTitle>name</LabelTitle>
                <Input type="text" required/> 
                <LabelTitle>email</LabelTitle>
                <Input type="email" required/> 
                <LabelTitle>password</LabelTitle>
                <Input type="password" required/>
                <LabelTitle>confirm password</LabelTitle>
                <Input type="password" required/> 
                <br />
                <InputSubmit type="submit" value="sign up"/>

                <RegisterTitle>
                    Already have an account? 
                    <Link to="/" style={{
                        textDecoration: 'none',
                        color: 'black',
                        fontWeight:'600',
                        }}>
                         Log in
                    </Link>
                </RegisterTitle>
            </SignUpContainer>
        </Container>
        </>
    )
}