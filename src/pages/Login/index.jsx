import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    Container,
    LoginContainer,
    Title,
    LabelTitle,
    Input,
    InputSubmit,
    RegisterTitle,
    Form
} from "./style";
import { api } from "../../services/axios";

export function Login() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('')

    const handleSubmit = (event) => {
        event.preventDefault();

        api.post('/api/auth/login', {
            email: email,
            password: password
        }).then((response) => {
            localStorage.clear();
            localStorage.setItem("userData", JSON.stringify(response.data));
            localStorage.setItem("userToken", response.data.token);
            navigate('/chat')
        }).catch((err) => {
            console.error("ops! ocorreu um erro" + err);
            alert(err.response.data.message);
        })
    }

    return (
        <>
            <Container>
                <LoginContainer>
                    <Form onSubmit={handleSubmit}>
                        <Title>login</Title>
                        <LabelTitle>email</LabelTitle>
                        <Input type="email" required onChange={(event) => {
                            setEmail(event.target.value);
                        }} />
                        <LabelTitle>password</LabelTitle>
                        <Input type="password" required onChange={(event) => {
                            setPassword(event.target.value);
                        }} />  <br />
                        <InputSubmit type="submit" value="log in" />
                    </Form>

                    <RegisterTitle>
                        Don't have an account?
                        <Link to="/createAccount" style={{
                            textDecoration: 'none',
                            color: 'black',
                            fontWeight: '600',
                        }}>
                            Register now
                        </Link>
                    </RegisterTitle>
                </LoginContainer>

            </Container>
        </>
    )
}