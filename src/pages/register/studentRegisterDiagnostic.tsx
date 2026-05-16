import MenuTop from "../../../components/Top/menuTop"
import Image from "next/image"
import { useRouter } from "next/router"
import { useState, useEffect } from "react"
import { TypeDataAlerts } from "../../../components/type"
import Alerts from "../../../components/alerts/alerts"

let dataAlerts:TypeDataAlerts = {
  alertType: 1,
  alertText: "",
  alertButtons: [""],
  alertsCommans: []
}

export default function StudentDiagnosticRegister(){

  const router = useRouter()
  const [studentDiagnostic, setStudentDiagnostic] = useState("")
  const [showAlerts, setshowAlerts] = useState(false);
  const [idStudent, setIdStudent] = useState("");

  useEffect(() => {
      const storedId = localStorage.getItem("id_student");
      if (storedId) {
        setIdStudent(storedId);
      }
  }, []);
  
  function AuthenticationsAlerts(){
    if (studentDiagnostic == ""){
      setshowAlerts(true)
      dataAlerts = {
        alertType: 2,
        alertText: "Adicione seu diagnostico",
        alertButtons: ["Editar"],
        alertsCommans: [()=>{setshowAlerts(false)}]
      }
    }else{
      RegisterDiagnosticStudent();
    }
  }
  
  const RegisterDiagnosticStudent = async () => {
    try{
      const idReq = "3";
      const endpoint = `/api/apiRegisterStudent?idReq=${idReq}&id=${idStudent}&diagnostico=${studentDiagnostic}`; 
      const response = await fetch(endpoint, {method: "POST", cache: "reload"})
      if(response.status === 200){
        router.push("/register/studentRegisterUser")
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
    <div className="bodyStudentDiagnosticRegister">
        {showAlerts&& <Alerts dataAlert={dataAlerts}/>}
        <div>
            <MenuTop/>
        </div>
        <div className="registerAreaStudentDiagnostic">
            <div className="registerStudantDiagnosticLogo">
                <Image className="registerStudantDiagnosticLogoImg" alt="logo" height={100} width={100} src={"/images/logo.jpeg"}/>
            </div>
            <div className="registerStudantDiagnosticBox">
              <h1 className="textStudentDiagnostic">Agora informe</h1>
              <h1 className="textStudentDiagnostic2">seu diagnostico:</h1>
              <select className="diagnosticStudantSelect" value={studentDiagnostic} onChange={(evt)=>setStudentDiagnostic(evt.target.value)}>
                <option value="">Selecione</option>
                <option value="TDAH">TDAH</option>
                <option value="Dislexia">Dislexia</option>
                <option value="TEA">TEA</option>
                <option value="Outro">Outro</option>
              </select>
              <h1 className="textStudentAgeHelp">Peça ajuda de seus pais,</h1>
              <h1 className="textStudentAgeHelp2">se necessário</h1>
              <button className="buttonRegisterStudantAge" onClick={()=>AuthenticationsAlerts()}>Próximo</button>
            </div>
        </div>
    </div>
  )}