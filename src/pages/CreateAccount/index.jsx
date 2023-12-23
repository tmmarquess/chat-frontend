import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    Container,
    SignUpContainer,
    Title,
    LabelTitle,
    Input,
    InputSubmit,
    RegisterTitle,
    Form
} from "./style";

import { api } from "../../services/axios";


export function CreateAccount() {
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleSubmit = (event) => {
        event.preventDefault();

        if (password !== confirmPassword) {
            alert("Passwords do not match");
        }

        api.post('/users', {
            name: name,
            email: email,
            password: password,
        }).then((response) => {
            navigate('/')
        }).catch((err) => {
            console.error("ops! ocorreu um erro" + err);
            alert(err.response.data.message);
        })
    }


    return (
        <>
            <Container>
                <SignUpContainer>

                    <Form onSubmit={handleSubmit}>
                        <Title>Create Account</Title>
                        <LabelTitle>name</LabelTitle>
                        <Input type="text" required onChange={(event) => {
                            setName(event.target.value);
                        }} />
                        <LabelTitle>email</LabelTitle>
                        <Input type="email" required onChange={(event) => {
                            setEmail(event.target.value)
                        }} />
                        <LabelTitle>password</LabelTitle>
                        <Input type="password" required onChange={(event) => {
                            setPassword(event.target.value)
                        }} />
                        <LabelTitle>confirm password</LabelTitle>
                        <Input type="password" required onChange={(event) => {
                            setConfirmPassword(event.target.value)
                        }} />
                        <br />
                        <InputSubmit type="submit" value="sign up" />
                    </Form>

                    <RegisterTitle>
                        Already have an account?
                        <Link to="/" style={{
                            textDecoration: 'none',
                            color: 'black',
                            fontWeight: '600',
                        }}>
                            Log in
                        </Link>
                    </RegisterTitle>
                </SignUpContainer>
            </Container>
        </>
    )
}