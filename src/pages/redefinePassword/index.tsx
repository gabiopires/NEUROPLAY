import MenuTop from "../../../components/Top/menuTop"
import Image from "next/image"
import { useRouter } from "next/router";
import { useState } from "react";
import { TypeDataAlerts } from "../../../components/type";
import Alerts from "../../../components/alerts/alerts";

let dataAlerts:TypeDataAlerts ={
    alertType: 0,
    alertText: "",
    alertButtons: [],
    alertsCommans: [],
  }

export default function RedefinePassword(){

    const [password, setPassword] = useState("");
    const [validatedpassword, setvalidatedpasswoord] = useState("")
    const [user, setUser] = useState("");
    const [userVerificated, setUserVerificated] = useState(false);
    const [role, setRole] = useState("");
    const [idUser, setIdUser] = useState(-1)
    const router = useRouter();
    const [showAlerts, setshowAlerts] = useState(false);
    const [messagePassword, setMessagePassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);


    const checkPasswordMatch = (password: string, confirmPassword: string) => {
        if (password.length < 8 && confirmPassword.length < 8) {
            setMessagePassword("❌ Digite pelo menos 8 caracteres");
        } else if (password === confirmPassword && password !== ""){
            setMessagePassword("✔ Senhas conferem");
        }    
        else {
            setMessagePassword("❌ As senhas não conferem");
        }
    }

    function AuthenticationsAlerts(){
        if (password != validatedpassword){
            setshowAlerts(true)
            dataAlerts = {
                alertType: 2,
                alertText: "Senhas não conferem",
                alertButtons: ["Editar"],
                alertsCommans: [()=>{setshowAlerts(false)}]
            }
        }else if (password == "" && validatedpassword == ""){
        setshowAlerts(true)
        dataAlerts = {
            alertType: 2,
            alertText: "Cadastre uma senha",
            alertButtons: ["Editar"],
            alertsCommans: [()=>{setshowAlerts(false)}]
        }
        }
        else if (password.length < 8){
            setshowAlerts(true)
            dataAlerts = {
                alertType: 2,
                alertText: "A senha deve conter pelo menos 8 caracteres",
                alertButtons: ["Editar"],
                alertsCommans: [()=>{setshowAlerts(false)}]
            }
        }else{
            redefinePassword()
        }
    }

  const verifyUser = async()=>{
    try{
        const endpont = `/api/apiRedefinePassword?username=${user}`;
        const response=await fetch(endpont,{method: "GET", cache:"reload"})
        const data = await response.json();
        if(response.status === 200){
            setUserVerificated(true);
            setshowAlerts(true)
            setRole(data.role)
            setIdUser(data.id)
            dataAlerts = {
                alertType: 1,
                alertText: "Agora defina uma senha com pelo menos 8 caracteres",
                alertButtons: ["Editar"],
                alertsCommans: [()=>{setshowAlerts(false)}]
            }
        }else if (response.status === 401){
            setshowAlerts(true)
            dataAlerts = {
                alertType: 1,
                alertText: "Usuario não existe",
                alertButtons: ["Editar"],
                alertsCommans: [()=>{setshowAlerts(false)}]
            }
        }else{
            setshowAlerts(true)
            dataAlerts = {
                alertType: 5,
                alertText: "Erro inesperado no servidor, tente novamente mais tarde",
                alertButtons: ["Ok"],
                alertsCommans: [()=>{setshowAlerts(false)}]
            }
        }
    }catch(error){
        console.log(error);
        setshowAlerts(true)
        dataAlerts = {
            alertType: 5,
            alertText: "Erro inesperado no servidor, tente novamente mais tarde",
            alertButtons: ["Ok"],
            alertsCommans: [()=>{setshowAlerts(false)}]
        }
    }
  }  

    async function redefinePassword(){
    try{
        let endpont = "";
        if(role == "Profissional"){
            endpont = `/api/apiRedefinePassword?userId=${idUser}&password=${password}&action=redefinePassProfessional`;
        }else if (role == "Estudante"){
            endpont = `/api/apiRedefinePassword?userId=${idUser}&password=${password}&action=redefinePassStudent`;
        }
        const response=await fetch(endpont,{method: "POST", cache:"reload"})
        if(response.status === 200){
            setshowAlerts(true)
            dataAlerts = {
                alertType: 3,
                alertText: "Senha redefinida com sucesso!",
                alertButtons: ["Ir para login"],
                alertsCommans: [()=>{router.push("/login")}]
            }
        }else{
            setshowAlerts(true)
            dataAlerts = {
                alertType: 5,
                alertText: "Erro inesperado no servidor, tente novamente mais tarde",
                alertButtons: ["Ok"],
                alertsCommans: [()=>{setshowAlerts(false)}]
            }
        }
    }catch(error){
        console.log(error);
        setshowAlerts(true)
        dataAlerts = {
            alertType: 5,
            alertText: "Erro inesperado no servidor, tente novamente mais tarde",
            alertButtons: ["Ok"],
            alertsCommans: [()=>{setshowAlerts(false)}]
        }
    }
  } 

 return (
    <div className="bodyRedefinePassword">
        {showAlerts&& <Alerts dataAlert={dataAlerts}/>}
        <div>
            <MenuTop/>
        </div>
        <div className="redefinePasswordArea">
            <div className="redefinePasswordLogo">
                <Image className="redefinePasswordLogoImg" alt="logo" height={100} width={100} src={"/images/logo.jpeg"}/>
            </div>
            <div className="redefinePasswordBox">
                <div>
                    <h1 className="redefinePassTextDesc">Por favor, insira seu usuário para redefinição da senha:</h1>
                    <h1 className="redefinePassTextUser">Usuário</h1>
                    <input type="text" className="redefinePassInput" value={user} onChange={(evt)=>{setUser(evt.target.value)}}onKeyDown={(e) => 
                        {
                            if (e.key === 'Enter') {
                                verifyUser()
                            }
                        }}>
                    </input>
                </div>
                {userVerificated == false ? <button className="buttonRedefinePassword_User" onClick={verifyUser}>Verificar usuário</button>:""}
                {userVerificated && 
                    <div className="redefinePasswordBoxPassContent">
                        <div className="redefinePasswordBoxPass">
                            <h1 className="textRedefinePassword">Senha</h1>
                            <div className="redefinePasswordInputBox">
                                <input type={showPassword ? "text" : "password"}  className="redefinePasswordInput" value={password} onChange={(evt)=>{const newPassword = evt.target.value;setPassword(newPassword);checkPasswordMatch(newPassword, validatedpassword);}}></input>
                                <span onClick={() => setShowPassword(!showPassword)} style={{ cursor: "pointer" }}>
                                    <Image alt="" className="redefinePasswordImage" height={100} width={100} src={showPassword ? "/images/visibility.svg" : "/images/visibility_off.svg"}/>
                                </span>
                            </div>
                            <h1 className="textRedefinePasswordValidated">Confirme a senha</h1>
                            <div className="redefinePasswordInputBox">
                                <input type={showConfirmPassword ? "text" : "password"}  className="redefinePasswordInput" value={validatedpassword} onChange={(evt)=>{const newConfirmPassword = evt.target.value;setvalidatedpasswoord(newConfirmPassword);checkPasswordMatch(password, newConfirmPassword);}} onKeyDown={(e) => 
                                    {
                                        if (e.key === 'Enter') {
                                            AuthenticationsAlerts()
                                        }
                                    }}>
                                </input>
                                <span onClick={() => setShowConfirmPassword(!showConfirmPassword)} style={{ cursor: "pointer" }}>
                                    <Image alt="" className="redefinePasswordImage" height={100} width={100} src={showConfirmPassword ? "/images/visibility.svg" : "/images/visibility_off.svg"}/>
                                </span>
                            </div>
                        </div>
                        <div className="MessageValidatedRedefinePassword">
                            <h1 className="textMessageValidatedRedefinePassword" style={{ color: password !== validatedpassword ? "red" : password.length < 8 && validatedpassword.length < 8 ? "red" : "green" }}>{messagePassword}</h1>
                        </div>
                        <button className="buttonRedefinePassword" onClick={()=>{AuthenticationsAlerts()}}>Redefinir senha</button>
                    </div>
                }
                <div className="buttonRedefinePassLogin" onClick={()=>{router.push("/login")}}>
                    Lembrei minha senha
                </div>
            </div>
        </div> 
    </div>
  )}