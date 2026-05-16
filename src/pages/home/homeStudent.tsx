import MenuTop from "../../../components/Top/menuTop"
import Activy from "../../../components/activity/activity"
import Image from "next/image"
import { useState, useEffect } from "react"
import { TypeDataLevel, TypeDataAlerts } from "../../../components/type"
import Alerts from "../../../components/alerts/alerts"

let dataAlerts:TypeDataAlerts ={
    alertType: 0,
    alertText: "",
    alertButtons: [],
    alertsCommans: [],
}

export default function Home(){

    const [dataLevel, setDataLevel] = useState<TypeDataLevel | null>(null);
    const [idStudent, setIdStudent] = useState("")
    const [showActivity, setShowActivity] = useState(false);
    const [showAlerts, setshowAlerts] = useState(false);
    const [cardsActivities, setCardsActivities] = useState([1,2,3,4,5])
    const [currentLevel, setCurrentLevel] = useState(0)
    const [currentMap, setCurrentMap] = useState("1Map")

    useEffect(() => {
        const storedId = localStorage.getItem("id");
        if (storedId) {
            getProgress(storedId);
            setIdStudent(storedId);
        }
    }, [showActivity])

    const getProgress = async (id: string) =>{
        try{
            const endpoint = `/api/apiLevels?idStudent=${id}&action=getProgressLevel`; 
            const response = await fetch(endpoint, {method: "GET", cache: "reload"})
            const data = await response.json();
            if(response.status === 200){
                setCurrentLevel(data.prog_id)
                return data.prog_id;
            }
            else{
                setshowAlerts(true)
                dataAlerts = {
                    alertType: 5,
                    alertText: "Erro ao carregar atividade, tente novamente mais tarde",
                    alertButtons: ["Ok"],
                    alertsCommans: [()=>{setshowAlerts(false)}]
                }
            }
        }catch(error){
            console.error("Error parsing response:", error);
        }
    }

    async function getActivity(indexLevel: number){
        const progress = await getProgress(idStudent)
        
        if(indexLevel > currentLevel && indexLevel > progress){
            setshowAlerts(true)
            dataAlerts = {
                alertType: 2,
                alertText: `Para fazer esse nível, conclua o nível ${currentLevel} primeiro`,
                alertButtons: ["Ok"],
                alertsCommans: [()=>{setshowAlerts(false)}]
            }
        }
        else if (indexLevel < currentLevel && indexLevel < progress){
            setshowAlerts(true)
            dataAlerts = {
                alertType: 2,
                alertText: "Você já concluiu esse nível! Deseja faze-lo novamente?",
                alertButtons: ["Procurar outro nível",`Realizar o nível ${indexLevel} novamente`],
                alertsCommans: [()=>{setshowAlerts(false)}, ()=>{seeLastActivitie(indexLevel)}]
            }
        }
        else if (indexLevel == currentLevel || indexLevel == progress){
            try{
                const endpoint = `/api/apiLevels?idLevel=${indexLevel}&action=getDataLevel`; 
                const response = await fetch(endpoint, {method: "GET", cache: "reload"})
                const data = await response.json();
                if(response.status === 200){
                    setDataLevel({
                        levelStudentId: idStudent,
                        levelId: indexLevel,
                        levelDescription: data.lev_description,
                        levelAnimalDesc: data.animal_description,
                        levelAnimalPhoto: data.animal_photo,
                        levelStampPhoto: data.stamp_photo,
                        levelAudio: data.lev_audio,
                        levelAudioDesc: data.aniDesc_audio,
                        levelRepeat: false,
                        activityComand: [()=>{setShowActivity(false)}],
                    });
                    setShowActivity(true);
                }
                else{
                    setshowAlerts(true)
                    dataAlerts = {
                        alertType: 5,
                        alertText: "Erro ao carregar atividade, tente novamente mais tarde",
                        alertButtons: ["Ok"],
                        alertsCommans: [()=>{setshowAlerts(false)}]
                    }
                }
            }catch(error){
            console.error("Error parsing response:", error);
            }
        }
    }

    async function seeLastActivitie(indexLevel: number){
        setshowAlerts(false)
        try{
            const endpoint = `/api/apiLevels?idLevel=${indexLevel}&action=getDataLevel`; 
            const response = await fetch(endpoint, {method: "GET", cache: "reload"})
            const data = await response.json();
            if(response.status === 200){
                setDataLevel({
                    levelStudentId: idStudent,
                    levelId: indexLevel,
                    levelDescription: data.lev_description,
                    levelAnimalDesc: data.animal_description,
                    levelAnimalPhoto: data.animal_photo,
                    levelStampPhoto: data.stamp_photo,
                    levelAudio: data.lev_audio,
                    levelAudioDesc: data.aniDesc_audio,
                    levelRepeat: true,
                    activityComand: [()=>{setShowActivity(false)}],
                });
                setShowActivity(true);
            }
            else{
                setshowAlerts(true)
                dataAlerts = {
                    alertType: 5,
                    alertText: "Erro ao carregar atividade, tente novamente mais tarde",
                    alertButtons: ["Ok"],
                    alertsCommans: [()=>{setshowAlerts(false)}]
                }
            }
        }catch(error){
        console.error("Error parsing response:", error);
        }
    }

    function ChangeMap(comand: string){
        if (currentMap == "1Map"){
            setCurrentMap("2Map")
            setCardsActivities([6,7,8,9,10])
        }else if (currentMap == "2Map" && comand == "previous"){
            setCurrentMap("1Map")
            setCardsActivities([1,2,3,4,5])
        }
    }

    return(
        <div className={`bodyHome${currentMap}`}>
            {showAlerts&& <Alerts dataAlert={dataAlerts}/>}
            <div>
                <MenuTop perfilProf={false} perfilStud={true}/>
            </div>
            <div className="homeBox">
                {currentMap != "1Map" ?
                    <div className="previousPage">
                        <Image className="previousPageImage" alt="seta" height={100} width={100} src={"/images/arrow_back.svg"} onClick={()=>{ChangeMap("previous")}}></Image>
                    </div>:""
                }
                {cardsActivities.map((i, index)=>(  
                    <div className="columActivity" key={index}>
                        <div className={`columActivy${i}`}>
                            {i <= currentLevel ? 
                                <div className={`cardActivity${i}`}></div>
                                :
                                <div className={`cardActivity${i}`} style={{ opacity: 0.7 }}></div>
                            }
                            {i <= currentLevel ?
                                <div className={`levelNumber${i}`} onClick={()=>getActivity(i)}>
                                    {/* {i} */}
                                    <Image className="levelNumberImg" alt="animal" height={100} width={100} src={`/images/num${i}.png`}/>
                                </div>:
                                <div className={`levelNumber${i}`} onClick={()=>getActivity(i)}>
                                    {/* {i} */}
                                    <Image className="levelNumberImg" alt="animal" style={{ opacity: 0.7 }} height={100} width={100} src={`/images/num${i}.png`}/>
                                </div>
                            }
                        </div>
                    </div>
                ))}
                {currentMap != "1Map" ?
                    <div className="nextPage">
                        <Image className="nextPageImage" alt="seta" height={100} width={100} src={"/images/arrow_forward.svg"} onClick={()=>{ChangeMap("next")}}></Image>
                    </div>
                    :
                    <div className="nextPage">
                        <Image className="nextPageImage" alt="seta" height={100} width={100} src={"/images/arrow_right.svg"} onClick={()=>{ChangeMap("next")}}></Image>
                    </div>
                }
            </div>
            {showActivity && dataLevel && (
                <Activy dataLevel={dataLevel} comandNextLevel={getActivity} />
            )}
        </div>
    )
}