import MenuTop from "../../../components/Top/menuTop"
import { useState, useEffect } from "react";
import Alerts from "../../../components/alerts/alerts";
import { TypeDataAlerts } from "../../../components/type";
import Image from "next/image";

let dataAlerts:TypeDataAlerts ={
    alertType: 0,
    alertText: "",
    alertButtons: [],
    alertsCommans: [],
  }

export default function AddStudents(){

    const [idProfessional, setIdProfessional] = useState("");
    const [childName, setChildName] = useState("");
    const [childAge, setChildAge] = useState("");
    const [childDiagnostic, setChildDiagnostic] = useState("");
    const [showAlerts, setshowAlerts] = useState(false);
    const [childUser, setChildUser] = useState("");
    const [childPassword, setChildPassword] = useState("")
    const [validatedpassword, setvalidatedpasswoord] = useState("")
    const [messagePassword, setMessagePassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const now =  Date.now()

    useEffect(() => {
        const storedId = localStorage.getItem("id");
        if (storedId) {
            setIdProfessional(storedId);
        }
    }, []);

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
        if (childName == "" || childName == "null" || childName == "NULL" || childName == "Null"){
          setshowAlerts(true)
          dataAlerts = {
            alertType: 2,
            alertText: "Adicione um nome",
            alertButtons: ["Editar"],
            alertsCommans: [()=>{setshowAlerts(false)}]
          }
        }
        else if (parseInt(childAge) == 0 || parseInt(childAge) >= 20){
          setshowAlerts(true)
          dataAlerts = {
            alertType: 2,
            alertText: "Digite uma idade válida",
            alertButtons: ["Editar"],
            alertsCommans: [()=>{setshowAlerts(false)}]
          }
        }
        else if (childDiagnostic == ""){
            setshowAlerts(true)
            dataAlerts = {
              alertType: 2,
              alertText: "Adicione um diagnostico",
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
            const idReq = "5";
            const endpoint = `/api/apiRegisterStudent?idReq=${idReq}&idProfessional=${idProfessional}&nameChild=${childName}&ageChild=${childAge}&diagnosticChild=${childDiagnostic}&userChild=${childUser}&passwordChild=${childPassword}&date=${date}`; 
            const response = await fetch(endpoint, {method: "POST", cache: "reload"})
            if(response.status === 200){
                setshowAlerts(true)
                dataAlerts = {
                    alertType: 3,
                    alertText: `${childName} Cadastrado(a) com sucesso`,
                    alertButtons: ["Ok"],
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

    return(
        <div className="bodyAddStudents">
            {showAlerts&& <Alerts dataAlert={dataAlerts}/>}
            <div>
                <MenuTop perfilProf={true}/>
            </div>
            <div className="addStudentsArea">
                <div className="addStudentsInfo">
                    <Image className="addStudentsInfoImg" alt="" height={100} width={100} src={'/images/addStudentsProf.png'}/>
                    <h1>Adicionar Alunos</h1>
                </div>
                <div className="addStudentsContent">
                    <div>
                        <h1 className="studentsBox_nameText">Nome Completo</h1>
                        <input type="text" className="nameChildInput" value={childName} onChange={(evt)=>{setChildName(evt.target.value)}}></input>
                    </div>
                    <div>
                        <h1 className="textChildAge">Idade</h1>
                        <input type="number" className="ageChildInput" value={childAge} onChange={(evt)=>setChildAge(evt.target.value)}></input>
                    </div>
                    <div>
                        <h1 className="textChildDiagnostic">Diagnostico</h1>
                        <select className="diagnosticChildSelect" value={childDiagnostic} onChange={(evt)=>setChildDiagnostic(evt.target.value)}>
                            <option value="">Selecione</option>
                            <option value="TDAH">TDAH</option>
                            <option value="Dislexia">Dislexia</option>
                            <option value="TEA">TEA</option>
                            <option value="Outro">Outros</option>
                        </select>
                    </div>
                    <div>
                        <h1 className="textUserTherapist">Nome de usuário</h1>
                        <input type="text" className="userTherapistInput" value={childUser} onChange={(evt)=>{setChildUser(evt.target.value)}}></input>
                    </div>
                    <div>
                        <h1 className="textTherapistPassword">Senha</h1>
                        <div className="passwordTherapistBox">
                            <input type={showPassword ? "text" : "password"} className="passwordTherapistInput" value={childPassword} onChange={(evt)=>{const newPassword = evt.target.value;setChildPassword(newPassword);checkPasswordMatch(newPassword, validatedpassword);}}></input>
                            <span onClick={() => setShowPassword(!showPassword)} style={{ cursor: "pointer" }}>
                                <Image alt="" className="redefinePasswordImage" height={100} width={100} src={showPassword ? "/images/visibility.svg" : "/images/visibility_off.svg"}/>
                            </span>
                        </div>
                    </div>
                    <div>
                        <h1 className="textTherapistPasswordValidated">Senha</h1>
                        <div className="passwordTherapistBox">
                            <input type={showConfirmPassword ? "text" : "password"} className="passwordValidatedTherapistInput" value={validatedpassword} onChange={(evt)=>{const newConfirmPassword = evt.target.value;setvalidatedpasswoord(newConfirmPassword);checkPasswordMatch(childPassword, newConfirmPassword);}} onKeyDown={(e) => 
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
                        <h1 className="textMessageValidatedPasswordTherapist" style={{ color: childPassword !== validatedpassword ? "red" : childPassword.length < 8 && validatedpassword.length < 8 ? "red" : "green" }}>{messagePassword}</h1>
                    </div>
                    <button className="buttonRegisterChild" onClick={()=>AuthenticationsAlerts()}>Cadastrar</button>
                </div>
            </div>
        </div>
    )
}