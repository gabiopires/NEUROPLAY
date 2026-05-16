import MenuTop from "../../../components/Top/menuTop"
import Image from "next/image"
import { useRouter } from "next/router";
import { useState } from "react";
import { TypeDataAlerts } from "../../../components/type";
import Alerts from "../../../components/alerts/alerts";

let dataAlerts:TypeDataAlerts = {
  alertType: 1,
  alertText: "",
  alertButtons: [""],
  alertsCommans: []
}

export default function StudentRegister(){

  const router = useRouter()
  const [studentName, setStudentName] = useState("")
  const [showAlerts, setshowAlerts] = useState(false)

  function AuthenticationsAlerts(){
    if (studentName == ""){
      setshowAlerts(true)
      dataAlerts = {
        alertType: 2,
        alertText: "Adicione seu nome",
        alertButtons: ["Editar"],
        alertsCommans: [()=>{setshowAlerts(false)}]
      }
    }else if (studentName == "null" || studentName == "NULL" || studentName == "Null"){
      setshowAlerts(true)
      dataAlerts = {
        alertType: 2,
        alertText: "Adicione um nome valido",
        alertButtons: ["Editar"],
        alertsCommans: [()=>{setshowAlerts(false)}]
      }
    }
    else{
      registerNameStudent();
    }
  }

  const registerNameStudent = async () => {
    try{
      const idReq = "1";
        const endpoint = `/api/apiRegisterStudent?idReq=${idReq}&nome=${studentName}`; 
        const response = await fetch(endpoint, {method: "POST", cache: "reload"})
        const data = await response.json();
        if(response.status === 200){
          localStorage.setItem("id_student", data.id_student);
          router.push("/register/studentRegisterAge")
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
    <div className="bodyStudentRegister">
      {showAlerts&& <Alerts dataAlert={dataAlerts}/>}
        <div>
            <MenuTop/>
        </div>
        <div className="registerAreaStudent">
            <div className="registerStudantLogo">
                <Image className="registerStudantLogoImg" alt="logo" height={100} width={100} src={"/images/logo.jpeg"}/>
            </div>
            <div className="registerStudantBox">
              <h1 className="textHelloStudent">Olá aluno, seja</h1>
              <h1 className="textwelcomeStudent">bem-vindo!</h1>
              <h1 className="textStudentName">Digite seu nome:</h1>
              <input type="text" className="nameStudantInput" value={studentName} onChange={(evt)=>setStudentName(evt.target.value)} onKeyDown={(e) => 
                {
                  if (e.key === 'Enter') {
                    AuthenticationsAlerts()
                  }
                }}>
              </input>
              <button className="buttonRegisterStudant" onClick={()=>AuthenticationsAlerts()}>Próximo</button>
            </div>
        </div>
    </div>
  )}