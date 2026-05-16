import MenuTop from "../../../components/Top/menuTop"
import Image from "next/image"
import { useRouter } from "next/router";
import { useState } from "react";
import Alerts from "../../../components/alerts/alerts";
import { TypeDataAlerts } from "../../../components/type";

let dataAlerts:TypeDataAlerts ={
    alertType: 0,
    alertText: "",
    alertButtons: [],
    alertsCommans: [],
}

export default function TherapistRegister(){

    const router = useRouter()
    const [nameTherapist, setNameTherapist] = useState("")
    const [emailTherapist, setEmailTherapist] = useState("")
    const [userTherapist, setUserTherapist] = useState("")
    const [passwordTherapist, setpasswordTherapist] = useState("")
    const [validatedpassword, setvalidatedpasswoord] = useState("")
    const [showAlerts, setshowAlerts] = useState(false)
    const [messagePassword, setMessagePassword] = useState("");
    const [messageEmail, setMessageEmail] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const regEx = /[a-zA-Z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,8}(.[a-z{2,8}])?/g;

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

  const checkEmail = (email: string)=> {
    if (regEx.test(email)){
        setMessageEmail("✔ E-mail válido")
    }else{
        setMessageEmail("❌ E-mail inválido")
    }
  }

  function AuthenticationsAlerts(){
    if (passwordTherapist != validatedpassword){
        setshowAlerts(true)
        dataAlerts = {
            alertType: 2,
            alertText: "Senhas não conferem",
            alertButtons: ["Editar"],
            alertsCommans: [()=>{setshowAlerts(false)}]
        }
    }
    else if (nameTherapist == "" || nameTherapist == "null" || nameTherapist == "NULL" || nameTherapist == "Null"){
        setshowAlerts(true)
        dataAlerts = {
            alertType: 2,
            alertText: "Adicione o seu nome completo",
            alertButtons: ["Editar"],
            alertsCommans: [()=>{setshowAlerts(false)}]
        }
    }
    else if (regEx.test(emailTherapist) == false || emailTherapist == "" || emailTherapist == "null" || emailTherapist == "NULL" || emailTherapist == "Null"){
        setshowAlerts(true)
        dataAlerts = {
            alertType: 2,
            alertText: "Adicione um e-mail válido",
            alertButtons: ["Editar"],
            alertsCommans: [()=>{setshowAlerts(false)}]
        }
    }
    else if (userTherapist == "" || userTherapist == "null" || userTherapist == "NULL" || userTherapist == "Null"){
        setshowAlerts(true)
        dataAlerts = {
            alertType: 2,
            alertText: "Adicione um usuário válido",
            alertButtons: ["Editar"],
            alertsCommans: [()=>{setshowAlerts(false)}]
        }
    }
    else if (passwordTherapist == "" && validatedpassword == ""){
        setshowAlerts(true)
        dataAlerts = {
            alertType: 2,
            alertText: "Cadastre uma senha",
            alertButtons: ["Editar"],
            alertsCommans: [()=>{setshowAlerts(false)}]
        }
    }
    else if (passwordTherapist.length < 8){
        setshowAlerts(true)
        dataAlerts = {
            alertType: 2,
            alertText: "A senha deve conter pelo menos 8 caracteres",
            alertButtons: ["Editar"],
            alertsCommans: [()=>{setshowAlerts(false)}]
        }
    }
    else{
        setshowAlerts(true)
        dataAlerts = {
            alertType: 1,
            alertTitle: "Compromisso com a Privacidade e a Proteção de Dados",
            alertText: "Como profissional responsável pelo cuidado de crianças, estou plenamente comprometido com a segurança e a privacidade das informações pessoais sob minha responsabilidade. Declaro estar de acordo com a Lei Geral de Proteção de Dados (LGPD) e garanto que nenhum dado das crianças será compartilhado com terceiros sem o consentimento legalmente exigido. A responsabilidade pelo uso, armazenamento e proteção desses dados é inteiramente minha, prezando sempre por um ambiente seguro, ético e respeitoso para todas as famílias.",
            alertButtons: ["Concordo com o termo de responsabilidade"],
            alertsCommans: [()=>{registerTherapist()}]
        }
    }
  }

  const registerTherapist = async () => {
    setshowAlerts(false)
    try{
        const descricao = "Terapeuta"
        const endpoint = `/api/apiRegisterProfessional?nome=${nameTherapist}&descricao=${descricao}&email=${emailTherapist}&username=${userTherapist}&password=${passwordTherapist}`; 
        const response = await fetch(endpoint, {method: "POST", cache: "reload"})
        const data = await response.json();
        if(response.status === 200){
            setshowAlerts(true)
            dataAlerts = {
                alertType: 3,
                alertText: "Usuário cadastrado com sucesso",
                alertButtons: ["Ok"],
                alertsCommans: [()=>{router.push("/login")}]
            }
            localStorage.setItem("id", data.id);
            setshowAlerts(true)
            dataAlerts = {
                alertType: 2,
                alertText: "Deseja cadastrar um paciente?",
                alertButtons: ["Cadastrar agora", "Cadastrar depois"],
                alertsCommans: [()=>{router.push("/register/childRegister")}, ()=>{router.push("/login")}]
            }
        }else if (response.status === 400){
            setshowAlerts(true)
            dataAlerts = {
                alertType: 2,
                alertText: "Usuário indisponivel, escolha outro",
                alertButtons: ["Editar"],
                alertsCommans: [()=>{setshowAlerts(false)}]
            }
        }else{
            setshowAlerts(true)
            dataAlerts = {
              alertType: 5,
              alertText: "Cadastro não concluido, tente novamente mais tarde",
              alertButtons: ["Ok"],
              alertsCommans: [()=>{setshowAlerts(false)}]
            }
          }
    } catch (error){
        console.error("Error parsing response:", error);
    }
  }

  return (
    <div className="bodytherapistRegister">
        {showAlerts&& <Alerts dataAlert={dataAlerts}/>}
        <div>
            <MenuTop/>
        </div>
        <div className="registerAreaTherapist">
            <div className="registerTherapistLogo">
                <Image className="registerTherapistLogoImg" alt="logo" height={100} width={100} src={"/images/logo.jpeg"}/>
            </div>
            <div className="registerTherapistBox">
                <div>
                    <h1 className="textNameTherapist">Nome Completo</h1>
                    <input type="text" className="nameTherapistInput" value={nameTherapist} onChange={(evt)=>{setNameTherapist(evt.target.value)}}></input>
                </div>
                <div>
                    <h1 className="textEmailTherapist">Email</h1>
                    <input type="text" className="emailTherapistInput" value={emailTherapist} onChange={(evt)=>{setEmailTherapist(evt.target.value);checkEmail(evt.target.value)}}></input>
                    <h1 className="ValidatedEmailTherapist" style={{ color: messageEmail === "❌ E-mail inválido" ? "red" : "green" }}>{messageEmail}</h1>
                </div>
                <div>
                    <h1 className="textUserTherapist">Nome de usuário</h1>
                    <input type="text" className="userTherapistInput" value={userTherapist} onChange={(evt)=>{setUserTherapist(evt.target.value)}}></input>
                </div>
                <div>
                    <h1 className="textTherapistPassword">Senha</h1>
                    <div className="passwordTherapistBox">
                        <input type={showPassword ? "text" : "password"} className="passwordTherapistInput" value={passwordTherapist} onChange={(evt)=>{const newPassword = evt.target.value;setpasswordTherapist(newPassword);checkPasswordMatch(newPassword, validatedpassword);}}></input>
                        <span onClick={() => setShowPassword(!showPassword)} style={{ cursor: "pointer" }}>
                            <Image alt="" className="redefinePasswordImage" height={100} width={100} src={showPassword ? "/images/visibility.svg" : "/images/visibility_off.svg"}/>
                        </span>
                    </div>
                </div>
                <div>
                    <h1 className="textTherapistPasswordValidated">Senha</h1>
                    <div className="passwordTherapistBox">
                        <input type={showConfirmPassword ? "text" : "password"} className="passwordValidatedTherapistInput" value={validatedpassword} onChange={(evt)=>{const newConfirmPassword = evt.target.value;setvalidatedpasswoord(newConfirmPassword);checkPasswordMatch(passwordTherapist, newConfirmPassword);}} onKeyDown={(e) => 
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
                <div className="MessageValidatedPasswordTherapist">
                    <h1 className="textMessageValidatedPasswordTherapist" style={{ color: passwordTherapist !== validatedpassword ? "red" : passwordTherapist.length < 8 && validatedpassword.length < 8 ? "red" : "green" }}>{messagePassword}</h1>
                </div>
                <button className="buttonRegisterTherapist" onClick={()=>AuthenticationsAlerts()}>Cadastrar</button>
                <h1 className="textHaveAccessTherapist" onClick={()=>router.push("/login")}>Possuo cadastro</h1>
            </div>
        </div>
    </div>
  )}