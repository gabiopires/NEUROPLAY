import MenuTop from "../../../components/Top/menuTop"
import Image from "next/image"
import { useState, useEffect, useRef } from "react";
import { TypeDataAlerts } from "../../../components/type";
import Alerts from "../../../components/alerts/alerts";
import FaceId from "../../../components/registerFaceId/faceId";
import path from "path";

let dataAlerts: TypeDataAlerts = {
    alertType: 0,
    alertText: "",
    alertButtons: [],
    alertsCommans: [],
}

export default function ProfileProf() {

    const [showAlerts, setshowAlerts] = useState(false);
    const [showFaceId, setshowFaceId] = useState(false);
    const regEx = /[a-zA-Z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,8}(.[a-z{2,8}])?/g;
    const [messagePassword, setMessagePassword] = useState("");
    const [messageEmail, setMessageEmail] = useState("");
    const inputAddImg = useRef<HTMLInputElement>(null);

    const [profileImage, setProfileImage] = useState('')
    const [editInfo, setEditInfo] = useState(false);
    const [profId, setProfId] = useState(0);
    const [nameProfissional, setNameProfissional] = useState("");
    const [userProfessional, setUserProfessional] = useState("");
    const [emailProfessional, setemailProfessional] = useState("");
    const [professional, setProfessional] = useState("");
    const [passwordProfessional, setPasswordProfessional] = useState("");
    const [hidePassword, setHidePassword] = useState(true);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [fileImgProfile, setFileImgProfile] = useState<any>(null);
    const [nameImgProfile, setNameImgProfile] = useState('')
    const [faceIdProfessional, setFaceIdProfessional] = useState(false);
    const [editNameProfissional, setEditNameProfissional] = useState("");
    const [editUserProfessional, setEditUserProfessional] = useState("");
    const [editEmailProfessional, setEditEmailProfessional] = useState("");
    const [editPasswordProfessional, setEditPasswordProfessional] = useState("");

    useEffect(() => {
        const storedId = localStorage.getItem("id");
        if (storedId) {
            getDataProfessional(storedId)
        }
    }, [editInfo])

    async function getDataProfessional(idProf: string) {
        try {
            const endpoint = `/api/apiProfileProf?idProfessional=${idProf}&action=getDataProfessional`;
            const response = await fetch(endpoint, { method: "GET", cache: "reload" })
            const data = await response.json();
            if (response.status === 200) {
                setNameProfissional(data.prof_name)
                setEditNameProfissional(data.prof_name)
                setUserProfessional(data.prof_user)
                setEditUserProfessional(data.prof_user)
                setemailProfessional(data.prof_email)
                setEditEmailProfessional(data.prof_email)
                setProfessional(data.prof_desc)
                setProfId(data.prof_id)
                setPasswordProfessional(data.prof_password)
                setEditPasswordProfessional(data.prof_password)
                setFaceIdProfessional(data.prof_faceId != null && data.prof_faceId !== "" ? true : false);
                setProfileImage(data.prof_profileImage);
            }
            else {
                setshowAlerts(true)
                dataAlerts = {
                    alertType: 5,
                    alertText: "Erro ao carregar dados, tente novamente mais tarde",
                    alertButtons: ["Ok"],
                    alertsCommans: [() => { setshowAlerts(false) }]
                }
            }
        } catch (error) {
            console.error("Error parsing response:", error);
        }
    }

    const checkPasswordMatch = (password: string) => {
        if (password.length < 8) {
            setMessagePassword("❌ Digite pelo menos 8 caracteres!");
        } else {
            setMessagePassword("✔ Senha válida")
        }
    };

    const checkEmail = (email: string) => {
        if (regEx.test(email)) {
            setMessageEmail("✔ E-mail válido")
        } else {
            setMessageEmail("❌ E-mail inválido")
        }
    }

    function AuthenticationsAlerts() {
        if (editNameProfissional == "" || editNameProfissional == "null" || editNameProfissional == "NULL" || editNameProfissional == "Null") {
            setEditNameProfissional(nameProfissional)
            setshowAlerts(true)
            dataAlerts = {
                alertType: 5,
                alertText: "Insira um valor válido para o nome",
                alertButtons: ["Editar"],
                alertsCommans: [() => { setshowAlerts(false); setEditInfo(false) }]
            }
        }
        else if (regEx.test(editEmailProfessional) == false || editEmailProfessional == "null" || editEmailProfessional == "NULL" || editEmailProfessional == "Null") {
            setEditEmailProfessional(emailProfessional)
            setshowAlerts(true)
            dataAlerts = {
                alertType: 2,
                alertText: "Adicione um e-mail válido",
                alertButtons: ["Editar"],
                alertsCommans: [() => { setshowAlerts(false) }]
            }
        }
        else if (editUserProfessional == "" || editUserProfessional == "null" || editUserProfessional == "NULL" || editUserProfessional == "Null") {
            setEditUserProfessional(userProfessional)
            setshowAlerts(true)
            dataAlerts = {
                alertType: 5,
                alertText: "Insira um valor válido para o Usuário",
                alertButtons: ["Editar"],
                alertsCommans: [() => { setshowAlerts(false); setEditInfo(false) }]
            }
        }
        else if (editPasswordProfessional == "") {
            setEditPasswordProfessional(passwordProfessional);
            setshowAlerts(true)
            dataAlerts = {
                alertType: 2,
                alertText: "Cadastre uma senha",
                alertButtons: ["Editar"],
                alertsCommans: [() => { setshowAlerts(false) }]
            }
        }
        else if (editPasswordProfessional.length < 8) {
            setEditPasswordProfessional(passwordProfessional);
            setshowAlerts(true)
            dataAlerts = {
                alertType: 2,
                alertText: "A senha deve conter pelo menos 8 caracteres",
                alertButtons: ["Editar"],
                alertsCommans: [() => { setshowAlerts(false) }]
            }
        }
        else {
            saveDataProfessional(profId)
        }
    }

    async function saveDataProfessional(idProf: number) {
        const resImg = await uploadImage(fileImgProfile, nameImgProfile);
        if (resImg === 200) {
            try {
                const endpoint = `/api/apiProfileProf?idProfessional=${idProf}&userProfissional=${editUserProfessional}&emailProfissional=${editEmailProfessional}&passwordProfessional=${editPasswordProfessional}&profileImage=${nameImgProfile}&action=saveDataProfessionalPhoto`;
                const response = await fetch(endpoint, { method: "POST", cache: "reload" })
                if (response.status === 200) {
                    setshowAlerts(true)
                    dataAlerts = {
                        alertType: 3,
                        alertText: "Dados salvos com sucesso!",
                        alertButtons: ["Ok"],
                        alertsCommans: [() => { setshowAlerts(false); setEditInfo(false) }]
                    }
                    setProfileImage(nameImgProfile);
                    getDataProfessional(`${idProf}`)
                }
                else {
                    setshowAlerts(true)
                    dataAlerts = {
                        alertType: 5,
                        alertText: "Erro ao salvar dados, tente novamente mais tarde",
                        alertButtons: ["Ok"],
                        alertsCommans: [() => { setshowAlerts(false); setEditInfo(false) }]
                    }
                }
            } catch (error) {
                console.error("Error parsing response:", error);
            }
        } else {
            try {
                const endpoint = `/api/apiProfileProf?idProfessional=${idProf}&userProfissional=${editUserProfessional}&emailProfissional=${editEmailProfessional}&passwordProfessional=${editPasswordProfessional}&action=saveDataProfessional`;
                const response = await fetch(endpoint, { method: "POST", cache: "reload" })
                if (response.status === 200) {
                    setshowAlerts(true)
                    dataAlerts = {
                        alertType: 3,
                        alertText: "Dados salvos com sucesso!",
                        alertButtons: ["Ok"],
                        alertsCommans: [() => { setshowAlerts(false); setEditInfo(false) }]
                    }
                    setProfileImage(nameImgProfile);
                    getDataProfessional(`${idProf}`)
                }
                else {
                    setshowAlerts(true)
                    dataAlerts = {
                        alertType: 5,
                        alertText: "Erro ao salvar dados, tente novamente mais tarde",
                        alertButtons: ["Ok"],
                        alertsCommans: [() => { setshowAlerts(false); setEditInfo(false) }]
                    }
                }
            } catch (error) {
                console.error("Error parsing response:", error);
            }
        }
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const addImgIcon = (evt: any) => {
        const name = nameProfissional.replaceAll(" ", "")
        const docfiles = evt.target.files[0];
        const nameImgAdd = docfiles.name;
        const fileExtension = path.extname(nameImgAdd);
        const newName = `${name}${profId}${fileExtension}`
        setNameImgProfile(newName);
        setFileImgProfile(docfiles);
    }

    async function uploadImage(image: File, nameImage: string) {
        const formData = new FormData();
        if (image) {
            formData.append("file", image);
            formData.append("name_file", nameImage);
            
            try {
                const response = await fetch("/api/apiUploadImage", {
                    method: "POST",
                    body: formData,
                });
                
                try {
                    // Se precisar usar os dados convertidos no futuro, remova o comentário da linha abaixo:
                    // const dataResponse = JSON.parse(textResponse); 
                    return response.status;
                }
                catch (error) {
                    console.error("Erro ao converter resposta:", error);
                    return "error";
                }
            }
            catch (error) {
                console.error("Falha no upload:", error);
                return "error";
            }
        }
    }

    const imageSource = (!profileImage || profileImage === "null" || profileImage === "undefined")
        ? "/images/account_circle.svg"
        : `/uploads/${profileImage}`;

    // Callback para atualizar status quando rosto for cadastrado com sucesso
    function handleFaceIdSuccess() {
        setshowFaceId(false);
        getDataProfessional(`${profId}`);
    }

    async function resetFaceId() {
        try {
            const endpoint = `/api/apiProfileProf?idProfessional=${profId}&action=deleteFaceId`;
            const response = await fetch(endpoint, { method: "PATCH", cache: "reload" })
            if (response.status === 200) {
                setshowAlerts(true)
                dataAlerts = {
                    alertType: 3,
                    alertText: "Face Id removido com sucesso!",
                    alertButtons: ["Ok"],
                    alertsCommans: [() => { setshowAlerts(false); setEditInfo(false) }]
                }
            }
            else {
                setshowAlerts(true)
                dataAlerts = {
                    alertType: 5,
                    alertText: "Erro ao remover Face Id, tente novamente mais tarde",
                    alertButtons: ["Ok"],
                    alertsCommans: [() => { setshowAlerts(false); setEditInfo(false) }]
                }
            }
        } catch (error) {
            console.error("Error parsing response:", error);
            setshowAlerts(true)
            dataAlerts = {
                alertType: 5,
                alertText: "Erro ao remover Face Id, tente novamente mais tarde",
                alertButtons: ["Ok"],
                alertsCommans: [() => { setshowAlerts(false); setEditInfo(false) }]
            }
        }
    }

    function aceptTermos(){
        setshowAlerts(true);
        dataAlerts = {
            alertType: 5,
            alertText: "Ao prosseguir, declaro que li e concordo com os Termos de Uso e a Política de Privacidade, autorizando a coleta, armazenamento e tratamento dos meus dados biométricos faciais para fins de autenticação e identificação no sistema, em conformidade com a Lei Geral de Proteção de Dados (LGPD – Lei nº 13.709/2018).",
            alertButtons: ["Concordo com os termos", 'Não concordo'],
            alertsCommans: [() => { setshowAlerts(false); showCompFaceId() }, () => setshowAlerts(false)]
        }
    }

    function showCompFaceId(){
        setshowFaceId(true);
    }

    return (
        <div className="bodyProfileProf">
            {showAlerts && <Alerts dataAlert={dataAlerts} />}
            {showFaceId && ( <FaceId userType="professional" id={profId} comandFaceId={() => {setshowFaceId(false)}} onSuccess={handleFaceIdSuccess}/>)}
            <div>
                <MenuTop perfilProf={true} perfilStud={false} />
            </div>
            <div className="profileProfArea">
                <div className="profileProfBox">
                    <div className="profileProfImg">
                        {editInfo == false ?
                            <div className="professionalImgBox"><Image className="professionalImg" alt='' height={100} width={100} src={imageSource} /></div> :
                            <input ref={inputAddImg} type="file" className="inputAddImage" accept=".svg, .png, .jpeg" onChange={(evt) => addImgIcon(evt)}></input>
                        }
                    </div>
                    <div className="profileProfContent">
                        <div className="profileProfDesc">
                            <h1>Profissão:</h1>
                            <h1>{professional}</h1>
                        </div>
                    </div>
                    <div className="profileProfContent">
                        <div className="profileProfDesc">
                            <h1>Nome:</h1>
                            <h1>{nameProfissional}</h1>
                        </div>
                    </div>
                    <div className="profileProfContent">
                        <div className="profileProfDesc">
                            <h1>E-mail:</h1>
                            {editInfo == false ?
                                <h1>{emailProfessional}</h1> :
                                /* Correção Erro 363: Ajustado onChange para usar blocos explícitos separados por ponto e vírgula */
                                <input className="profileProfessionalInput" placeholder={emailProfessional} value={editEmailProfessional} onChange={(evt) => { setEditEmailProfessional(evt.target.value); checkEmail(evt.target.value); }}></input>
                            }
                        </div>
                        {editInfo == true ? <h1 className="ValidatedEmailTeacher" style={{ color: messageEmail === "❌ E-mail inválido" ? "red" : "green" }}>{messageEmail}</h1> : ""}
                    </div>
                    <div className="profileProfContent">
                        <div className="profileProfDesc">
                            <h1>Usuário:</h1>
                            {editInfo == false ?
                                <h1>{userProfessional}</h1> :
                                <input className="profileProfessionalInput" placeholder={userProfessional} value={editUserProfessional} onChange={(evt) => { setEditUserProfessional(evt.target.value) }}></input>
                            }
                        </div>
                    </div>
                    <div className="profileProfContent">
                        <div className="profileProfDesc">
                            <h1>Senha:</h1>
                            {editInfo == false ?
                                <h1>********</h1> :
                                /* Correção Erro 395: Ajustado onChange para usar blocos explícitos separados por ponto e vírgula */
                                <input type={hidePassword ? "password" : "text"} className="profileProfessionalInput" placeholder={passwordProfessional} value={editPasswordProfessional} onChange={(evt) => { setEditPasswordProfessional(evt.target.value); checkPasswordMatch(evt.target.value); }}></input>
                            }
                            {editInfo == true ?
                                <span onClick={() => setHidePassword(!hidePassword)} style={{ cursor: "pointer" }}>
                                    <Image alt="" className="redefinePasswordImage" height={100} width={100} src={hidePassword ? "/images/visibility_off.svg" : "/images/visibility.svg"} />
                                </span> : ""
                            }
                        </div>
                        {editInfo == true ? <h1 className="textMessageValidatedPasswordTeacher" style={{ color: editPasswordProfessional.length < 8 ? "red" : "green" }}>{messagePassword}</h1> : ""}
                    </div>
                    <div className="profileProfContent">
                        <div className="profileProfDesc">
                            <h1>Face ID:</h1>

                            {editInfo === false ? (
                                <h1>{faceIdProfessional ? "Ativado" : "Desativado"}</h1>
                            ) : (
                                <div className="profileFaceInline">
                                    {faceIdProfessional === true ? (
                                        <h1>Ativado</h1>
                                    ) : (
                                        <h1>Desativado</h1>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                    {editInfo != false && faceIdProfessional === true ? <button onClick={() => resetFaceId()} className="profileProfButton">Remover Face ID</button> :  ""}
                    {editInfo != false && faceIdProfessional === false ? <button onClick={() => aceptTermos()} className="profileProfButton">Habilitar Face ID</button> : ""}
                    <div className="profileProfButtonBox">
                        {editInfo == false ?
                            <button onClick={() => setEditInfo(true)} className="profileProfButton">Editar informações</button> :
                            /* Correção Erro 344: Modificado onClick para separar funções com ponto e vírgula */
                            <button onClick={() => { setEditInfo(false); AuthenticationsAlerts(); setHidePassword(true); }} className="profileProfButton">Salvar</button>
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}