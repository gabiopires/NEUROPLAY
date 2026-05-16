import MenuTop from "../../../components/Top/menuTop"
import Image from "next/image"
import { useState, useEffect } from "react"
import { TypeDataAlerts, TypeStudentsProgressData } from "../../../components/type"
import { useRouter } from "next/router";
import Alerts from "../../../components/alerts/alerts"
import StudentsProgress from "../../../components/studentsProgress/studentsProgress";

let dataAlerts:TypeDataAlerts ={
  alertType: 0,
  alertText: "",
  alertButtons: [],
  alertsCommans: [],
}

export default function ProgressStudents(){

    const [showAlerts, setshowAlerts] = useState(false);
    const [studentsData, setStudetnsData] = useState<TypeStudentsProgressData[]>([]);
    const router = useRouter();

    useEffect(() => {
        const storedId = localStorage.getItem("id");
        if (storedId) {
            getStudents(storedId);
        }
    }, [])

    async function getStudents(idUser: string){
        try{
            const endpoint = `/api/apiProgress?idProfessional=${idUser}&action=getProgressStudentsProf`; 
            const response = await fetch(endpoint, {method: "GET", cache: "reload"})
            const data = await response.json();
            if(response.status === 200){
                setStudetnsData(data);
            }
            else if(response.status === 401){
                setshowAlerts(true)
                dataAlerts = {
                    alertType: 1,
                    alertText: "Você ainda não possui alunos! Deseja cadastra-los agora?",
                    alertButtons: ["Cadastrar depois", "Cadastrar agora"],
                    alertsCommans: [()=>{setshowAlerts(false)},()=>{router.push("/addStudents")}]
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
        <div className="bodyProgressStudents">
            {showAlerts&& <Alerts dataAlert={dataAlerts}/>}
            <div>
                <MenuTop perfilProf={true} perfilStud={false}/>
            </div>
            <div className="ProgressStudentsContent">
                <div className="progressStudentsInfo">
                    <Image className="progressStudentsInfoImg" alt="" height={100} width={100} src={'/images/progressProf.png'}/>
                    <h1>Progresso</h1>
                </div>
                <div className="infoProgressStudents">
                    <div className="infoProgressStudentsTop">
                        <h1>Nome</h1>
                        <h1>Nivel Atual</h1>
                        <h1>Data</h1>
                        <h1>Log de Audios</h1>
                    </div>
                    <div className="infoProgressStudentsContent">
                        {studentsData.map((data, index)=>(
                            <StudentsProgress studentsData={data} key={index}/>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
