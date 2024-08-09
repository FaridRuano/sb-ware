"use client";
import { useRouter } from 'next/navigation';
//import { Input, Button } from "@nextui-org/react";
import { useState } from "react";
import {
    GoogleAuthProvider,
    signInWithEmailAndPassword,
    signInWithPopup,
} from 'firebase/auth';
import { auth, provider } from '@app/api/auth/settings';

//import toast, { Toaster } from 'react-hot-toast';

export default function LoginForm() {

    const [data, setData] = useState({
        email: '',
        password: ''
    });

    const router = useRouter();



    const logGoogle = async () => {

        try {
            signInWithPopup(auth, provider)
                .then((result) => {
                    // This gives you a Google Access Token. You can use it to access the Google API.
                    const credential = GoogleAuthProvider.credentialFromResult(result);
                    const token = credential.accessToken;
                    // The signed-in user info.
                    const user = result.user;
                    localStorage.setItem('user', JSON.stringify(user));
                    router.push('/client');
                    // IdP data available using getAdditionalUserInfo(result)
                    // ...
                }).catch((error) => {
                    // Handle Errors here.
                    const errorCode = error.code;
                    const errorMessage = error.message;
                    // The email of the user's account used.
                    const email = error.customData.email;
                    // The AuthCredential type that was used.
                    const credential = GoogleAuthProvider.credentialFromError(error);
                    // ...
                });
        } catch (error) {
            console.log(error.message);
            //toast.error("Credenciales Inválidas")
        }

    }

    const log = async () => {
        if (!canSubmit) {

        } else {
            try {
                await signInWithEmailAndPassword(auth, data.email, data.password).then(
                    res => {

                        localStorage.setItem('user', JSON.stringify(res.user));
                        router.push('/client');
                    })
            } catch (error) {
                console.log(error.message);

            }
        }


    }
    const { ...allData } = data;

    const canSubmit = [...Object.values(allData)].every(Boolean);

    return (
        <div>
            <h2 >Bienvenido</h2>
            <input
                name="email"
                id="email"
                onChange={(e) => {
                    setData({
                        ...data,
                        email: e.target.value
                    });
                }}
                type="email" label="Email" />
            <input
                name="password"
                id="password"
                onChange={(e) => {
                    setData({
                        ...data,
                        password: e.target.value
                    });
                }}
                type="password" label="Contraseña" />
            <button
                onClick={log}
            >
                Ingresar
            </button>

            <button
                onClick={logGoogle}
            >
                Iniciar sesión con Google
            </button>
        </div>

    );
}