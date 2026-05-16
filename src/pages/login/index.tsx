//Face ID
import * as faceapi from "face-api.js";
import { useEffect, useRef } from "react";

import MenuTop from "../../../components/Top/menuTop"
import Image from "next/image"
import { useRouter } from "next/router";
import { useState } from "react";
import { TypeDataAlerts } from "../../../components/type";
import Alerts from "../../../components/alerts/alerts";

let dataAlerts: TypeDataAlerts = {
    alertType: 0,
    alertText: "",
    alertButtons: [],
    alertsCommans: [],
}

export default function Login() {

    const [password, setPassword] = useState("");
    const [user, setUser] = useState("");
    const router = useRouter();
    const [showAlerts, setshowAlerts] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    //Face ID
    const [showFaceModal, setShowFaceModal] = useState(false);
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const [modelsLoaded, setModelsLoaded] = useState(false);


    useEffect(() => {
        if (showFaceModal) {
            loadModels().then(() => {
                startCamera();
            });
        }
    }, [showFaceModal]);

    const LoginUser = async () => {
        try {
            const endpont = `/api/apiLogin?username=${user}&password=${password}`;
            const response = await fetch(endpont, { method: "GET", cache: "reload" })
            const data = await response.json();
            if (response.status === 200) {
                if (data.role == "Professor" || data.role == "Terapeuta") {
                    localStorage.setItem("id", data.id);
                    router.push("/home/homeProfessional")
                } else if (data.role == "Estudante") {
                    localStorage.setItem("id", data.id);
                    router.push("/home/homeStudent")
                }
            } else if (response.status === 401) {
                setshowAlerts(true)
                dataAlerts = {
                    alertType: 1,
                    alertText: "Usuario ou senha incorretos",
                    alertButtons: ["Editar"],
                    alertsCommans: [() => { setshowAlerts(false) }]
                }
            } else {
                setshowAlerts(true)
                dataAlerts = {
                    alertType: 5,
                    alertText: "Erro inesperado no servidor, tente novamente mais tarde",
                    alertButtons: ["Ok"],
                    alertsCommans: [() => { setshowAlerts(false) }]
                }
            }
        } catch (error) {
            console.error(error);
            setshowAlerts(true)
            dataAlerts = {
                alertType: 5,
                alertText: "Erro inesperado no servidor, tente novamente mais tarde",
                alertButtons: ["Ok"],
                alertsCommans: [() => { setshowAlerts(false) }]
            }
        }
    }

    //Face ID
    async function handleFaceLogin() {

        if (!modelsLoaded) {
            setshowAlerts(true)
            dataAlerts = {
                alertType: 2,
                alertText: "Aguarde, carregando reconhecimento facial...",
                alertButtons: ["Ok"],
                alertsCommans: [() => setshowAlerts(false)]
            }
            return;
        }

        if (!videoRef.current) return;

        const detection = await faceapi
            .detectSingleFace(videoRef.current, new faceapi.TinyFaceDetectorOptions())
            .withFaceLandmarks()
            .withFaceDescriptor();

        if (!detection) {
            setshowAlerts(true)
            dataAlerts = {
                alertType: 2,
                alertText: "Nenhum rosto detectado 😢",
                alertButtons: ["Ok"],
                alertsCommans: [() => setshowAlerts(false)]
            }
            return;
        }

        const descriptorArray = Array.from(detection.descriptor);

        try {
            const response = await fetch("/api/apiLogin", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ face: descriptorArray })
            });

            const data = await response.json();

            if (response.status === 200) {
                localStorage.setItem("id", data.id);

                if (data.role === "Estudante") {
                    setshowAlerts(true)
                    dataAlerts = {
                        alertType: 3,
                        alertText: "Login realizado com sucesso!",
                        alertButtons: ["Ok"],
                        alertsCommans: [() => {router.push("/home/homeStudent")}]
                    }
                } else {
                    setshowAlerts(true)
                    dataAlerts = {
                        alertType: 3,
                        alertText: "Login realizado com sucesso!",
                        alertButtons: ["Ok"],
                        alertsCommans: [() => {router.push("/home/homeProfessional")}]
                    }
                }

            } else {
                setshowAlerts(true)
                dataAlerts = {
                    alertType: 1,
                    alertText: "Rosto não reconhecido 😢",
                    alertButtons: ["Ok"],
                    alertsCommans: [() => setshowAlerts(false)]
                }
            }

        } catch (error) {
            console.error(error);
        }
    }

    const loadModels = async () => {
    try {
        const MODEL_URL = "/models";
        await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
        await faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL);
        await faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL);
        setModelsLoaded(true);

    } catch (error) {
        console.error(error);
        setshowAlerts(true)
        dataAlerts = {
            alertType: 5,
            alertText: "Erro ao carregar modelos, tente novamente mais tarde",
            alertButtons: ["Ok"],
            alertsCommans: [() => { setshowAlerts(false) }]
        }
    }
};

    const startCamera = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: true,
            });

            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }
        } catch (err) {
            console.error("Erro ao acessar câmera:", err);
        }
    };

    const closeFaceModal = () => {
        setShowFaceModal(false);

        if (videoRef.current && videoRef.current.srcObject) {
            const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
            tracks.forEach(track => track.stop());
        }
    };

    return (
        <div className="bodyLogin">
            {showAlerts && <Alerts dataAlert={dataAlerts} />}

            {showFaceModal && (
                <div className="faceModalOverlay">
                    <div className="faceModal">

                        <h2>Login com Face ID</h2>

                        <video
                            ref={videoRef}
                            autoPlay
                            muted
                            width={300}
                            height={200}
                            className="faceVideo"
                        />

                        <div className="faceButtons">
                            <button onClick={closeFaceModal} className="cancelButton">
                                Cancelar
                            </button>

                            <button onClick={handleFaceLogin} className="loginButton">
                                Fazer login
                            </button>
                        </div>

                    </div>
                </div>
            )}
            <div>
                <MenuTop />
            </div>
            <div className="signInArea">
                <div className="signInAreaLogo">
                    <Image className="signInAreaLogoImg" alt="logo" height={100} width={100} src={"/images/logo.jpeg"} />
                </div>
                <div className="signInBox">
                    <div>
                        <h1 className="textUser">Usuário</h1>
                        <input type="text" className="userInput" value={user} onChange={(evt) => { setUser(evt.target.value) }}></input>
                    </div>
                    <div>
                        <h1 className="textPassword">Senha</h1>
                        <div className="passwordBox">
                            <input type={showPassword ? "text" : "password"} className="passwordInput" value={password} onChange={(evt) => { setPassword(evt.target.value) }} onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    LoginUser()
                                }
                            }}>
                            </input>
                            <span onClick={() => setShowPassword(!showPassword)} style={{ cursor: "pointer" }}>
                                <Image alt="" className="redefinePasswordImage" height={100} width={100} src={showPassword ? "/images/visibility.svg" : "/images/visibility_off.svg"} />
                            </span>
                        </div>
                    </div>

                    <button className="buttonEnter" onClick={() => { LoginUser() }}>Entrar
                    </button>
                    <div className="faceLoginBox">
                        <Image
                            src="/images/face-icon.svg"
                            alt="Face ID"
                            width={40}
                            height={40}
                            onClick={() => setShowFaceModal(true)}
                            style={{ cursor: "pointer" }}
                        />
                    </div>
                    <h1 className="textRecoverPass" onClick={() => router.push("/redefinePassword")}>Esqueceu a senha</h1>
                    <h1 className="textFirstAccess" onClick={() => router.push("/register")}>Primeiro acesso</h1>
                </div>
            </div>
        </div>
    )
}