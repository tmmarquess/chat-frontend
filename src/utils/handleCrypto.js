import JSEncrypt from 'jsencrypt';
import CryptoJS from 'crypto-js'
import { api } from '../services/axios';

const arrayBufferToPEM = (buffer, label) => {
    const uint8Array = new Uint8Array(buffer);
    const base64String = btoa(String.fromCharCode.apply(null, uint8Array));
    const pemString = `-----BEGIN ${label}-----\n${base64String}\n-----END ${label}-----\n`;
    return pemString;
}

const pemToArrayBuffer = (pem) => {
    const base64 = pem.replace(/-----[A-Z ]+-----/g, '').replace(/\s/g, '');
    const binaryString = atob(base64);
    const length = binaryString.length;
    const bytes = new Uint8Array(length);

    for (let i = 0; i < length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }

    return bytes.buffer;
}

const exportKeyPair = async (keys) => {
    const publicKeyExported = await crypto.subtle.exportKey('spki', keys.publicKey);
    const privateKeyExported = await crypto.subtle.exportKey('pkcs8', keys.privateKey);

    const publicKey = arrayBufferToPEM(publicKeyExported, 'PUBLIC KEY');
    const privateKey = arrayBufferToPEM(privateKeyExported, 'PRIVATE KEY');

    return { publicKey, privateKey };
}

export const generateKeypair = async () => {
    const keyPair = await window.crypto.subtle.generateKey({
        name: 'RSA-OAEP',
        modulusLength: 2048,
        publicExponent: new Uint8Array([0x01, 0x00, 0x01]), // 65537
        hash: { name: 'SHA-256' },
    }, true, ['encrypt', 'decrypt'])

    return await exportKeyPair(keyPair);
}

export const generateAESKey = async () => {
    const key = await crypto.subtle.generateKey({ name: 'AES-GCM', length: 256 }, true, ['encrypt', 'decrypt']);

    const exportedKey = await crypto.subtle.exportKey("jwk", key);

    return exportedKey;
}

export const signMessage = async (encryptedMessage, privateKey) => {

    const bufferKey = pemToArrayBuffer(privateKey);

    const importedKey = await crypto.subtle.importKey(
        'pkcs8',
        bufferKey,
        { name: 'RSASSA-PKCS1-v1_5', hash: { name: 'SHA-256' } },
        true,
        ['sign']
    )

    const messageToSignBuffer = new TextEncoder().encode(encryptedMessage);

    const signature = await crypto.subtle.sign({ name: 'RSASSA-PKCS1-v1_5', hash: { name: 'SHA-256' } }, importedKey, messageToSignBuffer);

    const base64Signature = btoa(String.fromCharCode.apply(null, new Uint8Array(signature)));

    return base64Signature;
}

export const verifyMessage = async (encryptedMessage, base64Signature, senderEmail) => {

    const config = {
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('userToken')}`
        }
    }
    const publicKey = await api.get(`/users/pubkey/${senderEmail}`, config);

    const bufferKey = pemToArrayBuffer(publicKey.data);

    const signatureArrayBuffer = new Uint8Array([...atob(base64Signature)].map(char => char.charCodeAt(0))).buffer;

    const importedKey = await crypto.subtle.importKey(
        'spki',
        bufferKey,
        { name: 'RSASSA-PKCS1-v1_5', hash: { name: 'SHA-256' } },
        true,
        ['verify']
    );

    const messageBuffer = new TextEncoder().encode(encryptedMessage);

    const verified = await crypto.subtle.verify({ name: 'RSASSA-PKCS1-v1_5', hash: { name: 'SHA-256' } }, importedKey, signatureArrayBuffer, messageBuffer);

    return verified;
}

// export const RSAEncrypt = (message, publicKey) => {
//     const encrypter = new JSEncrypt();
//     encrypter.setPublicKey(publicKey);
//     console.log(publicKey);
//     return encrypter.encrypt(message);
// }

export const RSAEncrypt = async (message, publicKey) => {
    const encodedMessage = new TextEncoder().encode(message);

    var bufferKey = pemToArrayBuffer(publicKey);
    const importedKey = await crypto.subtle.importKey(
        'spki',
        bufferKey,
        { name: 'RSA-OAEP', hash: { name: 'SHA-256' } },
        true,
        ['encrypt']
    );

    const encryptedBuffer = await crypto.subtle.encrypt({
        name: "RSA-OAEP",
    }, importedKey, encodedMessage);

    return btoa(String.fromCharCode(...new Uint8Array(encryptedBuffer)));
}

// export const RSADecrypt = (message, privateKey) => {
//     const decrypter = new JSEncrypt();
//     decrypter.setPrivateKey(privateKey);
//     return decrypter.decrypt(message);
// }

export const RSADecrypt = async (message, privateKey) => {
    const encryptedBuffer = new Uint8Array([...atob(message)].map(char => char.charCodeAt(0)));

    var bufferKey = pemToArrayBuffer(privateKey);
    const importedKey = await crypto.subtle.importKey(
        'pkcs8',
        bufferKey,
        { name: 'RSA-OAEP', hash: { name: 'SHA-256' } },
        true,
        ['decrypt']
    );

    const decryptedBuffer = await crypto.subtle.decrypt({
        name: "RSA-OAEP",
    }, importedKey, encryptedBuffer);

    return new TextDecoder().decode(decryptedBuffer);
}

export const AESEncrypt = (message, key) => {
    return CryptoJS.AES.encrypt(message, key).toString();
}

export const AESDecrypt = (message, key) => {
    const bytes = CryptoJS.AES.decrypt(message, key);
    return bytes.toString(CryptoJS.enc.Utf8);
}