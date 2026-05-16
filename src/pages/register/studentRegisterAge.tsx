import MenuTop from "../../../components/Top/menuTop"
import Image from "next/image"
import { useRouter } from "next/router"
import { TypeDataAlerts } from "../../../components/type";
import Alerts from "../../../components/alerts/alerts";
import { useState, useEffect } from "react";

let dataAlerts:TypeDataAlerts = {
  alertType: 1,
  alertText: "",
  alertButtons: [""],
  alertsCommans: []
}

export default function StudentAgeRegister(){

  const router = useRouter();
  const [showAlerts, setshowAlerts] = useState(false);
  const [studentAge, setStudentAge] = useState("");
  const [idStudent, setIdStudent] = useState("");

  useEffect(() => {
    const storedId = localStorage.getItem("id_student");
    if (storedId) {
      setIdStudent(storedId);
    }
}, []);

  function AuthenticationsAlerts(){
    if (studentAge == ""){
      setshowAlerts(true)
      dataAlerts = {
        alertType: 2,
        alertText: "Adicione sua idade",
        alertButtons: ["Editar"],
        alertsCommans: [()=>{setshowAlerts(false)}]
      }
    }else if (parseInt(studentAge) == 0 || parseInt(studentAge) >= 20){
      setshowAlerts(true)
      dataAlerts = {
        alertType: 2,
        alertText: "Adicione uma idade válida",
        alertButtons: ["Editar"],
        alertsCommans: [()=>{setshowAlerts(false)}]
      }
    }else{
      registerNameStudent();
    }
  }

  const registerNameStudent = async () => {
    try{
      const idReq = "2";
      const endpoint = `/api/apiRegisterStudent?idReq=${idReq}&id=${idStudent}&idade=${studentAge}`; 
      const response = await fetch(endpoint, {method: "POST", cache: "reload"})
      if(response.status === 200){
        router.push("/register/studentRegisterDiagnostic")
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
    <div className="bodyStudentAgeRegister">
      {showAlerts&& <Alerts dataAlert={dataAlerts}/>}
      <div>
          <MenuTop/>
      </div>
      <div className="registerAreaStudentAge">
          <div className="registerStudantAgeLogo">
              <Image className="registerStudantAgeLogoImg" alt="logo" height={100} width={100} src={"/images/logo.jpeg"}/>
          </div>
          <div className="registerStudantAgeBox">
            <h1 className="textStudentAge">Agora digite sua idade:</h1>
            <input type="number" className="ageStudantInput" value={studentAge} onChange={(evt)=>setStudentAge(evt.target.value)} onKeyDown={(e) => 
              {
                if (e.key === 'Enter') {
                    AuthenticationsAlerts()
                }
              }}>
            </input>
            <h1 className="textStudentAgeHelp">Peça ajuda de seus pais,</h1>
            <h1 className="textStudentAgeHelp2">se necessário</h1>
            <button className="buttonRegisterStudantAge" onClick={()=>AuthenticationsAlerts()}>Próximo</button>
          </div>
      </div>
    </div>
  )}