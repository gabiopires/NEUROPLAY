import MenuTop from "../../../components/Top/menuTop"
import Image from "next/image"
import { useState, useEffect } from "react"
import { TypeDataAlerts, TypeStudentsData } from "../../../components/type"
import Alerts from "../../../components/alerts/alerts"
import { useRouter } from "next/router";
import StudentsInfo from "../../../components/studentsInfo/studentsInfo"

let dataAlerts:TypeDataAlerts ={
  alertType: 0,
  alertText: "",
  alertButtons: [],
  alertsCommans: [],
}

export default function StudentsProfessional(){

    const [showAlerts, setshowAlerts] = useState(false);
    const [qtdStudents, setQtdStudents] = useState(0);
    const [studentsData, setStudetnsData] = useState<TypeStudentsData[]>([])    
    const router = useRouter();

    useEffect(() => {
        const storedId = localStorage.getItem("id");
        if (storedId) {
            getStudents(storedId);
        }
    }, [])


    async function getStudents(idUser: string){
        try{
            const endpoint = `/api/apiProfessional?idProfessional=${idUser}&action=getDataStudents`; 
            const response = await fetch(endpoint, {method: "GET", cache: "reload"})
            const data = await response.json();
            if(response.status === 200){
                setQtdStudents(data.length);
                setStudetnsData(data);
            }
            else if(response.status === 401){
                setshowAlerts(true)
                dataAlerts = {
                    alertType: 1,
                    alertText: "Você ainda não possui alunos! Deseja cadastra-los agora?",
                    alertButtons: ["Cadastrar depois", "Cadastrar agora"],
                    alertsCommans: [()=>{setshowAlerts(false); setQtdStudents(0)},()=>{router.push("/addStudents")}]
                }
            }else{
                setshowAlerts(true)
                dataAlerts = {
                    alertType: 5,
                    alertText: "Erro ao carregar alunos, tente novamente mais tarde",
                    alertButtons: ["Ok"],
                    alertsCommans: [()=>{setshowAlerts(false)}]
                }
            }
        }catch(error){
            console.error("Error parsing response:", error);
        }
    }

    return(
        <div className="bodyStudentsProf">
            {showAlerts&& <Alerts dataAlert={dataAlerts}/>}
            <div>
                <MenuTop perfilProf={true} perfilStud={false}/>
            </div>
            <div className="studentsProfContent">
                <div className="qtdStudents">
                    <Image className="studentsProfImg" alt="" height={100} width={100} src={'/images/studentsProf.png'}/>
                    <h1>{qtdStudents} Alunos</h1>
                </div>
                <div className="infoStudents">
                    <div className="infoStudentsTop">
                        <h1>Nome</h1>
                        <h1>Idade</h1>
                        <h1>Diagnostico</h1>
                        <h1>User</h1>
                    </div>
                    <div className="infoStudentsContent">
                        {studentsData.map((data, index)=>(
                            <StudentsInfo key={index} studentsData={data}/>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
