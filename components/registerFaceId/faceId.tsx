import * as faceapi from "face-api.js";
import { useState, useEffect, useRef } from "react";
import { TypeDataAlerts } from "../type";
import Alerts from "../alerts/alerts";

export interface dataFaceId {
    id: number;
    userType: "student" | "professional";
    comandFaceId: () => void;
    onSuccess: () => void;
}

let dataAlerts: TypeDataAlerts = {
    alertType: 0,
    alertText: "",
    alertButtons: [],
    alertsCommans: [],
}

export default function FaceId(props: dataFaceId) {    
    const [showAlerts, setshowAlerts] = useState(false);
    const videoRef = useRef<HTMLVideoElement>(null);
    const [modelsLoaded, setModelsLoaded] = useState(false);

    useEffect(() => {
        // Inicia modelos e video ao montar o componente
        loadModels().then(startVideo);

        // Função de cleanup: desliga a câmera ao fechar o componente
        return () => {
            if (videoRef.current && videoRef.current.srcObject) {
                const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
                tracks.forEach(track => track.stop());
            }
        };
    }, []);

    async function startVideo() {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }
        } catch (err) {
            console.error("Erro ao acessar câmera", err);
        }
    }

    async function loadModels() {
        const url = "/models";

        await faceapi.nets.tinyFaceDetector.loadFromUri(url);
        await faceapi.nets.faceLandmark68Net.loadFromUri(url);
        await faceapi.nets.faceRecognitionNet.loadFromUri(url);

        setModelsLoaded(true);
    }

    async function registerFace() {
        if (!videoRef.current) return;

        const detection = await faceapi
            .detectSingleFace(videoRef.current, new faceapi.TinyFaceDetectorOptions())
            .withFaceLandmarks()
            .withFaceDescriptor();

        if (!detection) {
            setshowAlerts(true)
            dataAlerts = {
                alertType: 2,
                alertText: "Nenhum rosto detectado!",
                alertButtons: ["Tentar novamente"],
                alertsCommans: [() => setshowAlerts(false)]
            }
            return;
        }

        const descriptorArray = Array.from(detection.descriptor);

        if(props.userType === "professional"){
            try {
                const response = await fetch(`/api/apiProfileProf?idProfessional=${props.id}&action=saveFaceId`, {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ faceId: descriptorArray })
                });

                if (response.status === 200) {
                    setshowAlerts(true)
                    dataAlerts = {
                        alertType: 3,
                        alertText: "Face Id registrada com sucesso!",
                        alertButtons: ["Ok"],
                        alertsCommans: [() => {
                            setshowAlerts(false);
                            props.onSuccess(); 
                        }]
                    }
                } else {
                    setshowAlerts(true)
                    dataAlerts = {
                        alertType: 5,
                        alertText: "Erro ao registrar a face id",
                        alertButtons: ["Ok"],
                        alertsCommans: [() => setshowAlerts(false)]
                    }
                }

            } catch (error) {
                console.error(error);
                setshowAlerts(true)
                dataAlerts = {
                    alertType: 5,
                    alertText: "Erro inesperado ao registrar a face id",
                    alertButtons: ["Ok"],
                    alertsCommans: [() => setshowAlerts(false)]
                }
            }
        }else if(props.userType === "student"){
            try {
                const response = await fetch(`/api/apiProfileStudent?idStudent=${props.id}&action=saveFaceId`, {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ faceId: descriptorArray })
                });

                if (response.status === 200) {
                    setshowAlerts(true)
                    dataAlerts = {
                        alertType: 3,
                        alertText: "Face Id registrada com sucesso!",
                        alertButtons: ["Ok"],
                        alertsCommans: [() => {
                            setshowAlerts(false);
                            props.onSuccess(); 
                        }]
                    }
                } else {
                    setshowAlerts(true)
                    dataAlerts = {
                        alertType: 5,
                        alertText: "Erro ao registrar a face id",
                        alertButtons: ["Ok"],
                        alertsCommans: [() => setshowAlerts(false)]
                    }
                }

            } catch (error) {
                console.error(error);
                setshowAlerts(true)
                dataAlerts = {
                    alertType: 5,
                    alertText: "Erro inesperado ao registrar a face id",
                    alertButtons: ["Ok"],
                    alertsCommans: [() => setshowAlerts(false)]
                }
            }
        }
    }

    return (
        <div className='bodyFaceId'>
            {showAlerts && <Alerts dataAlert={dataAlerts} />}
            <div className="boxFaceId">
                <div className="profileFaceContainer">
                    <video
                        ref={videoRef}
                        autoPlay
                        muted
                        width={300}
                        height={200}
                        className="profileVideo"
                    />
                    
                    <div className="profileProfButtonBox faceIdButtonContainer">
                        <button onClick={registerFace} className="profileProfButton" disabled={!modelsLoaded}>
                            {modelsLoaded ? "Registrar rosto" : "Carregando..."}
                        </button>
                        <button onClick={props.comandFaceId} className="profileProfButton">
                            Cancelar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}