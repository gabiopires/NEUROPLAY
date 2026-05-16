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

export default function TeacherRegister(){

    const router = useRouter()
    const [nameTeacher, setNameTeacher] = useState("")
    const [emailTeacher, setEmailTeacher] = useState("")
    const [userTeacher, setUserTeacher] = useState("")
    const [passwordTeacher, setpasswordTeacher] = useState("")
    const [validatedpassword, setvalidatedpasswoord] = useState("")
    const [showAlerts, setshowAlerts] = useState(false)
    const [messagePassword, setMessagePassword] = useState("");
    const [messageEmail, setMessageEmail] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const regEx = /[a-zA-Z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,8}(.[a-z{2,8}])?/g;


  const checkPasswordMatch = (password: string, confirmPassword: string) => {
    if (password.length < 8 && confirmPassword.length < 8) {
        setMessagePassword("❌ Digite pelo menos 8 caracteres!");
    } else if (password === confirmPassword && password !== ""){
        setMessagePassword("✔ Senhas conferem!");
    }    
    else {
        setMessagePassword("❌ As senhas não conferem!");
    }
  };

  const checkEmail = (email: string)=> {
    if (regEx.test(email)){
        setMessageEmail("✔ E-mail válido")
    }else{
        setMessageEmail("❌ E-mail inválido")
    }
  }

  function AuthenticationsAlerts(){
    if (passwordTeacher != validatedpassword){
        setshowAlerts(true)
        dataAlerts = {
            alertType: 2,
            alertText: "Senhas não conferem",
            alertButtons: ["Editar"],
            alertsCommans: [()=>{setshowAlerts(false)}]
        }
    }
    else if (nameTeacher == "" || nameTeacher == "null" || nameTeacher == "NULL" || nameTeacher == "Null"){
        setshowAlerts(true)
        dataAlerts = {
            alertType: 2,
            alertText: "Adicione o seu nome completo",
            alertButtons: ["Editar"],
            alertsCommans: [()=>{setshowAlerts(false)}]
        }
    }
    else if (regEx.test(emailTeacher) == false || emailTeacher == "null" || emailTeacher == "NULL" || emailTeacher == "Null"){
        setshowAlerts(true)
        dataAlerts = {
            alertType: 2,
            alertText: "Adicione um e-mail válido",
            alertButtons: ["Editar"],
            alertsCommans: [()=>{setshowAlerts(false)}]
        }
    }
    else if (userTeacher == "" || userTeacher == "null" || userTeacher == "NULL" || userTeacher == "Null"){
        setshowAlerts(true)
        dataAlerts = {
            alertType: 2,
            alertText: "Adicione um usuário válido",
            alertButtons: ["Editar"],
            alertsCommans: [()=>{setshowAlerts(false)}]
        }
    }
    else if (passwordTeacher == "" && validatedpassword == ""){
        setshowAlerts(true)
        dataAlerts = {
            alertType: 2,
            alertText: "Cadastre uma senha",
            alertButtons: ["Editar"],
            alertsCommans: [()=>{setshowAlerts(false)}]
        }
    }
    else if (passwordTeacher.length < 8){
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
            alertsCommans: [()=>{registerTeacher()}]
        }
    }
  }

  const registerTeacher = async () => {
    setshowAlerts(false)
    try{
        const descricao = "Professor"
        const endpoint = `/api/apiRegisterProfessional?nome=${nameTeacher}&descricao=${descricao}&email=${emailTeacher}&username=${userTeacher}&password=${passwordTeacher}`; 
        const response = await fetch(endpoint, {method: "POST", cache: "reload"})
        const data = await response.json();
        if(response.status === 200){
            setshowAlerts(true)
            dataAlerts = {
                alertType: 3,
                alertText: "Usuário cadastrado com sucesso",
                alertButtons: ["Ok"],
                alertsCommans: [()=>{setshowAlerts(false)}]
            }
            localStorage.setItem("id", data.id);
            setshowAlerts(true)
            dataAlerts = {
                alertType: 2,
                alertText: "Deseja cadastrar um aluno?",
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
    <div className="bodyTeacherRegister">
        {showAlerts&& <Alerts dataAlert={dataAlerts}/>}
        <div>
            <MenuTop/>
        </div>
        <div className="registerAreaTeacher">
            <div className="registerTeacherLogo">
                <Image className="registerTeacherLogoImg" alt="logo" height={100} width={100} src={"/images/logo.jpeg"}/>
            </div>
            <div className="registerTherapistBox">
                <div>
                    <h1 className="textNameTeacher">Nome Completo</h1>
                    <input type="text" className="nameTeacherInput" value={nameTeacher} onChange={(evt)=>{setNameTeacher(evt.target.value)}}></input>
                </div>
                <div>
                    <h1 className="textEmailTeacher">Email</h1>
                    <input type="text" className="emailTeacherInput" value={emailTeacher} onChange={(evt)=>{setEmailTeacher(evt.target.value);checkEmail(evt.target.value)}}></input>
                    <h1 className="ValidatedEmailTeacher" style={{ color: messageEmail === "❌ E-mail inválido" ? "red" : "green" }}>{messageEmail}</h1>
                </div>
                <div>
                    <h1 className="textUserTeacher">Nome de usuário</h1>
                    <input type="text" className="userTeacherInput"value={userTeacher} onChange={(evt)=>{setUserTeacher(evt.target.value)}}></input>
                </div>
                <div>
                    <h1 className="textTeacherPassword">Senha</h1>
                    <div className="passwordTeacherBox">
                        <input type={showPassword ? "text" : "password"} className="passwordTeacherInput" value={passwordTeacher} onChange={(evt)=>{const newPassword = evt.target.value;setpasswordTeacher(newPassword);checkPasswordMatch(newPassword, validatedpassword);}}></input>
                        <span onClick={() => setShowPassword(!showPassword)} style={{ cursor: "pointer" }}>
                            <Image alt="" className="redefinePasswordImage" height={100} width={100} src={showPassword ? "/images/visibility.svg" : "/images/visibility_off.svg"}/>
                        </span>
                    </div>
                </div>
                <div>
                    <h1 className="textTeacherPasswordValidated">Confirme sua senha</h1>
                    <div className="passwordTeacherBox">
                        <input type={showConfirmPassword ? "text" : "password"} className="passwordValidatedTeacherInput" value={validatedpassword} onChange={(evt)=>{const newConfirmPassword = evt.target.value;setvalidatedpasswoord(newConfirmPassword);checkPasswordMatch(passwordTeacher, newConfirmPassword);}} onKeyDown={(e) => 
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
                <div className="MessageValidatedPasswordTeacher">
                    <h1 className="textMessageValidatedPasswordTeacher" style={{ color: passwordTeacher !== validatedpassword ? "red" : passwordTeacher.length < 8 && validatedpassword.length < 8 ? "red" : "green" }}>{messagePassword}</h1>
                </div>
                <button className="buttonRegisterTeacher" onClick={()=>AuthenticationsAlerts()}>Cadastrar</button>
                <h1 className="textHaveAccessTeacher" onClick={()=>router.push("/login")}>Possuo cadastro</h1>
            </div>
        </div>
    </div>
  )}