import Image from "next/image"
import MenuTop from "../../../components/Top/menuTop"
import { useState, useEffect } from "react"
import { useRouter } from "next/router";
import { TypeDataAlerts } from "../../../components/type"
import Alerts from "../../../components/alerts/alerts";

let dataAlerts:TypeDataAlerts ={
    alertType: 0,
    alertText: "",
    alertButtons: [],
    alertsCommans: [],
}

export default function HomeProfessional(){

    const router = useRouter();
    const [showAlerts, setshowAlerts] = useState(false);
    const [nameProfissional, setNameProfissional] = useState("")
    const [imgProfessional, setImgProfessional] = useState("")

    useEffect(() => {
        const storedId = localStorage.getItem("id");
        if (storedId) {
            getDataProfessional(storedId)
        }
    }, [])

    async function getDataProfessional(idProf: string){
        try{
            const endpoint = `/api/apiProfessional?idProfessional=${idProf}&action=getDataProfessional`; 
            const response = await fetch(endpoint, {method: "GET", cache: "reload"})
            const data = await response.json();
            if(response.status === 200){
                setNameProfissional(data.prof_name);
                if(data.prof_profileImage != null || data.prof_profileImage != undefined || data.prof_profileImage != ''){
                    setImgProfessional(data.prof_profileImage);
                }
            }
            else{
                setshowAlerts(true)
                dataAlerts = {
                    alertType: 5,
                    alertText: "Erro ao carregar dados, tente novamente mais tarde",
                    alertButtons: ["Ok"],
                    alertsCommans: [()=>{setshowAlerts(false)}]
                }
            }
        }catch(error){
        console.error("Error parsing response:", error);
        }
    } 

    return (
        <div className="bodyProfessional">
            <MenuTop perfilProf={true} perfilStud={false}/>
            {showAlerts&& <Alerts dataAlert={dataAlerts}/>}
            <div className="professionalContent">
                <div className="professionalPerfil" onClick={()=>router.push("/profile/profileProf")}>
                    <Image className="professionalImgPerfil" alt='' height={100} width={100} src={imgProfessional == null ? '/images/account_circle.svg' : `/uploads/${imgProfessional}`}/>
                    {nameProfissional}
                </div>
                <div className="professionalOptions">
                    <div className="studentsBox" onClick={()=>router.push("/studentsProfessional")}>
                        Alunos
                        <Image alt="" height={100} width={100} src={'/images/studentsProf.png'}/>
                    </div>
                    <div className="addStudentsBox" onClick={()=>router.push("/addStudents")}>
                        Incluir alunos
                        <Image alt="" height={100} width={100} src={'/images/addStudentsProf.png'}/>
                    </div>
                    <div className="progressStudentsBox" onClick={()=>router.push("/progressStudents")}>
                        Progresso
                        <Image alt="" height={100} width={100} src={'/images/progressProf.png'}/>
                    </div>
                    <div className="reportStudentsBox" onClick={()=>router.push("/reportStudents")}>
                        Relatórios
                        <Image alt="" height={100} width={100} src={'/images/reportProf.png'}/>
                    </div>
                </div>
            </div>
        </div>
    )
}