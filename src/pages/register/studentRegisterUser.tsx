import MenuTop from "../../../components/Top/menuTop"
import Image from "next/image"
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { TypeDataAlerts } from "../../../components/type";
import Alerts from "../../../components/alerts/alerts";

let dataAlerts:TypeDataAlerts ={
  alertType: 0,
  alertText: "",
  alertButtons: [],
  alertsCommans: [],
}

export default function StudentRegisterUser(){

  const [passworStudent, setpasswordStudent] = useState("")
  const [validatedpassword, setvalidatedpasswoord] = useState("")
  const [showAlerts, setshowAlerts] = useState(false)
  const [messagePassword, setMessagePassword] = useState("");
  const [userStudent, setUserStudent] = useState("")
  const [idStudent, setIdStudent] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter()
  const now =  Date.now()

  useEffect(() => {
        const storedId = localStorage.getItem("id_student");
        if (storedId) {
          setIdStudent(storedId);
        }
  }, []);

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

  function AuthenticationsAlerts(){
    if (userStudent == ""){
      setshowAlerts(true)
      dataAlerts = {
        alertType: 2,
        alertText: "Adicione um usuário",
        alertButtons: ["Editar"],
        alertsCommans: [()=>{setshowAlerts(false)}]
      }
    }
    else if (userStudent == "null" || userStudent == "NULL" || userStudent == "Null"){
      setshowAlerts(true)
      dataAlerts = {
        alertType: 2,
        alertText: "Digite um usuário válido",
        alertButtons: ["Editar"],
        alertsCommans: [()=>{setshowAlerts(false)}]
      }
    }
    else if (passworStudent == "null" || passworStudent == "NULL" || passworStudent == "Null"){
      setshowAlerts(true)
      dataAlerts = {
        alertType: 2,
        alertText: "Digite uma senha válida",
        alertButtons: ["Editar"],
        alertsCommans: [()=>{setshowAlerts(false)}]
      }
    }
    else if (passworStudent != validatedpassword){
      setshowAlerts(true)
      dataAlerts = {
        alertType: 2,
        alertText: "Senhas não conferem",
        alertButtons: ["Editar"],
        alertsCommans: [()=>{setshowAlerts(false)}]
      }
    }
    else if (passworStudent == "" && validatedpassword == ""){
      setshowAlerts(true)
      dataAlerts = {
        alertType: 2,
        alertText: "Cadastre uma senha",
        alertButtons: ["Editar"],
        alertsCommans: [()=>{setshowAlerts(false)}]
      }
    }
    else if (passworStudent.length < 8){
      setshowAlerts(true)
      dataAlerts = {
        alertType: 2,
        alertText: "A senha deve conter pelo menos 8 caracteres",
        alertButtons: ["Editar"],
        alertsCommans: [()=>{setshowAlerts(false)}]
      }
    }
    else{
        RegisterUserStudent();
    }
  }

  const editDate=()=>{
    const date = new Date(now);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  const RegisterUserStudent = async () => {
    const date = editDate();
    try{
      const idReq = "4";
      const endpoint = `/api/apiRegisterStudent?idReq=${idReq}&id=${idStudent}&user=${userStudent}&password=${passworStudent}&date=${date}`; 
      const response = await fetch(endpoint, {method: "POST", cache: "reload"})
      if(response.status === 200){
        localStorage.removeItem("id_student");
        setshowAlerts(true)
        dataAlerts = {
          alertType: 3,
          alertText: "Usuário cadastrado com sucesso",
          alertButtons: ["Ok"],
          alertsCommans: [()=>{router.push("/login")}]
        }
      }else if (response.status === 400){
        setshowAlerts(true)
        dataAlerts = {
          alertType: 2,
          alertText: "Usuário indisponivel, escolha outro",
          alertButtons: ["Editar"],
          alertsCommans: [()=>{setshowAlerts(false)}]
        }
      }
      else{
        setshowAlerts(true)
        dataAlerts = {
          alertType: 5,
          alertText: "Cadastro não concluido, tente novamente mais tarde",
          alertButtons: ["Ok"],
          alertsCommans: [()=>{setshowAlerts(false)}]
        }
      }
    }catch(error){
      console.error("Error parsing response:", error);
    }
  }

  return (
    <div className="bodyStudentRegisterUser">
        {showAlerts&& <Alerts dataAlert={dataAlerts}/>}
        <div>
            <MenuTop/>
        </div>
        <div className="registerUserAreaStudent">
            <div className="registerUserStudantLogo">
                <Image className="registerUserStudantLogoImg" alt="logo" height={100} width={100} src={"/images/logo.jpeg"}/>
            </div>
            <div className="registerUserStudantBox">
              <h1 className="textRegisterUserStudent">Agora informe um</h1>
              <h1 className="textRegisterPassStudent">usuário e senha:</h1>
              <h1 className="textStudentUser">Digite seu usuário:</h1>
              <input type="text" className="userStudantInput" value={userStudent} onChange={(evt)=>{setUserStudent(evt.target.value)}}></input>
              <h1 className="textStudentPassword">Digite sua senha:</h1>
              <div className="studentPasswordBox">
                <input type={showPassword ? "text" : "password"}  className="passStudantInput" value={passworStudent} onChange={(evt)=>{const newPassword = evt.target.value;setpasswordStudent(newPassword);checkPasswordMatch(newPassword, validatedpassword);}}></input>
                <span onClick={() => setShowPassword(!showPassword)} style={{ cursor: "pointer" }}>
                  <Image alt="" className="redefinePasswordImage" height={100} width={100} src={showPassword ? "/images/visibility.svg" : "/images/visibility_off.svg"}/>
                </span>
              </div>
              <h1 className="textStudentPassword">Confirme sua senha:</h1>
              <div className="studentPasswordBox">
                <input type={showConfirmPassword ? "text" : "password"}  className="confirmPassStudantInput" value={validatedpassword} onChange={(evt)=>{const newConfirmPassword = evt.target.value;setvalidatedpasswoord(newConfirmPassword);checkPasswordMatch(passworStudent, newConfirmPassword);}} onKeyDown={(e) => 
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
              <div className="MessageValidatedPasswordStudente">
                  <h1 className="textMessageValidatedPasswordStudent" style={{ color: passworStudent !== validatedpassword ? "red" : passworStudent.length < 8 && validatedpassword.length < 8 ? "red" : "green" }}>{messagePassword}</h1>
              </div>
              <button className="buttonUserRegisterStudant" onClick={()=>AuthenticationsAlerts()}>Próximo</button>
            </div>
        </div>
    </div>
  )}